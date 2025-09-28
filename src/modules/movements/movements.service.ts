import { HttpException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as fs from 'fs'
import * as moment from 'moment-timezone'
import { AwsS3Service } from 'src/aws-s3/aws-s3.service'
import { EmployeesService } from 'src/modules/employees/employees.service'
import { Repository } from 'typeorm'
import { CustomLogger } from 'src/modules/common/logger/custom-logger.service'

import { CreateMovementDto } from './dto/create-movement.dto'
import { UpdateMovementDto } from './dto/update-movement.dto'
import { Movement } from './entities/movement.entity'

@Injectable()
export class MovementsService {
	constructor(
		@InjectRepository(Movement)
		private readonly movementRepository: Repository<Movement>,
		private readonly awsS3Service: AwsS3Service,
		private readonly employeeService: EmployeesService,
		private readonly logger: CustomLogger
	) {
		this.logger.setContext('MovementsService')
	}

	async createMovementPhotoTablet(
		createMovementDto: CreateMovementDto,
		image: Express.Multer.File
	): Promise<any> {
		const startTime = Date.now()

		try {
			this.logger.business('Starting point registration', {
				employeePis: createMovementDto.employeePis,
				company: createMovementDto.company,
				region: createMovementDto.region,
				imageSize: image?.size || 0
			})

			const pis = createMovementDto.employeePis
			const now = moment()
				.tz(createMovementDto.region)
				.format('YYYY-MM-DD HH:mm:ss')

			this.logger.debug(
				`Checking last movement - PIS: ${pis}, Timestamp: ${now}`
			)

			const lastMovement = await this.verifyLastMovement(pis, now)

			if (!lastMovement) {
				this.logger.business(
					`No recent movement found - proceeding with registration - PIS: ${pis}`
				)

				this.checkDirectory()
				const path = this.saveImageDirectory(createMovementDto, image)
				createMovementDto.image = path

				const movement = this.movementRepository.create(createMovementDto)
				const response = await this.movementRepository.save(movement)

				const processingTime = Date.now() - startTime

				this.logger.business(
					`Point registered successfully - PIS: ${pis}, ID: ${response.uuid}, Time: ${processingTime}ms`
				)

				return {
					msg: 'Ponto Registrado',
					date: moment().tz(createMovementDto.region).format('DD-MM-YYYY'),
					hour: moment().tz(createMovementDto.region).format('HH:mm'),
					response,
					success: true
				}
			} else {
				const lastMovementTime = moment(lastMovement.register).format(
					'HH:mm:ss'
				)
				const currentTime = moment().format('HH:mm:ss')

				this.logger.warn(
					`Movement rejected - waiting time not met - PIS: ${pis}, Last: ${lastMovementTime}, Current: ${currentTime}`
				)

				return {
					msg: 'Aguarde 2 minutos',
					date: moment(lastMovement.register).format('DD/MM/YYYY'),
					hour: moment(lastMovement.register).format('HH:mm'),
					success: false
				}
			}
		} catch (error) {
			const processingTime = Date.now() - startTime

			this.logger.error(
				`Error registering point - PIS: ${createMovementDto.employeePis} - ${error.message}`,
				error.stack,
				'MovementsService'
			)

			this.logger.business('Point registration failed', {
				employeePis: createMovementDto.employeePis,
				error: error.message,
				processingTime: `${processingTime}ms`
			})

			throw error
		}
	}

	async createMovementToRegistration(
		createMovementDto: CreateMovementDto,
		image: Express.Multer.File,
		registration: string
	): Promise<Movement> {
		this.checkDirectory()

		const path = this.saveImageDirectory(createMovementDto, image)

		createMovementDto.image = path
		createMovementDto.employeePis = await this.getForRegistration(
			registration,
			createMovementDto.company
		)

		const movement = this.movementRepository.create(createMovementDto)

		return await this.movementRepository.save(movement)
	}

	async getTracks(
		pis: string,
		initialDate: string,
		endDate: string
	): Promise<any[]> {
		try {
			this.logger.business(
				`Getting employee tracks - PIS: ${pis}, From: ${initialDate}, To: ${endDate}`
			)

			const tracks = await this.movementRepository
				.createQueryBuilder('mov')
				.select([
					'mov.uuid',
					'mov.image',
					'mov.date',
					'mov.register',
					'mov.formRegister',
					'mov.company',
					'mov.employeePis',
					'mov.latitude',
					'mov.longitude',
					'mov.type'
				])
				.leftJoin('employees', 'emp', 'emp.id = mov.employee_pis')
				.where('mov.date BETWEEN :initialDate AND :endDate', {
					initialDate: moment(initialDate).format('YYYY-MM-DD'),
					endDate: moment(endDate).format('YYYY-MM-DD')
				})
				.andWhere('mov.employee_pis = :pis', { pis })
				.orderBy('mov.register', 'DESC')
				.getMany()

			this.logger.business(
				`Tracks retrieved successfully - PIS: ${pis}, Count: ${tracks.length}`
			)

			return tracks
		} catch (error) {
			this.logger.error(
				`Error getting tracks - PIS: ${pis} - ${error.message}`,
				error.stack,
				'MovementsService'
			)
			throw error
		}
	}

	async create(
		createMovementDto: CreateMovementDto,
		file: Express.Multer.File
	): Promise<Movement> {
		createMovementDto.image = await this.addFile(file)
		const movement = this.movementRepository.create(createMovementDto)

		this.logger.business(
			`Creating movement - PIS: ${createMovementDto.employeePis}, Company: ${createMovementDto.company}`
		)

		return await this.movementRepository.save(movement)
	}

	async createBach(
		createMovementDto: CreateMovementDto,
		file: Express.Multer.File
	): Promise<Movement> {
		createMovementDto.image = await this.addFile(file)
		const movement = this.movementRepository.create(createMovementDto)

		return await this.movementRepository.save(movement)
	}

	async addFile(file: Express.Multer.File): Promise<string> {
		if (file === null) {
			throw new HttpException('invalid image!', 400)
		}
		const bucketKey = `${file.fieldname}${Date.now()}`
		const fileUrl = await this.awsS3Service.uploadFile(file, bucketKey)

		this.logger.debug(
			`File uploaded to S3 - Key: ${bucketKey}, Size: ${file.size} bytes`
		)

		return fileUrl
	}

	async findAll(): Promise<Movement[]> {
		this.logger.debug('Finding all movements')
		return await this.movementRepository.find({
			select: [
				'uuid',
				'image',
				'date',
				'register',
				'company',
				'employeePis',
				'latitude',
				'longitude',
				'type',
				'formRegister',
				'nsr'
			],
			relations: {
				company: true
			}
		})
	}

	async findOne(uuid: string): Promise<Movement> {
		this.logger.debug(`Finding movement by ID: ${uuid}`)

		const movement = await this.movementRepository.findOne({
			select: [
				'uuid',
				'image',
				'date',
				'register',
				'company',
				'employeePis',
				'latitude',
				'longitude',
				'type',
				'formRegister',
				'nsr'
			],
			where: { uuid },
			relations: {
				company: true
			}
		})

		if (!movement) {
			this.logger.warn(`Movement not found: ${uuid}`)
			throw new NotFoundException(`Não achei um Movement com o uuid ${uuid}`)
		}

		return movement
	}

	async findForRegistration(employeePis: string): Promise<Movement[]> {
		this.logger.debug(`Finding movements for employee: ${employeePis}`)

		const movements = await this.movementRepository.find({
			select: [
				'uuid',
				'image',
				'date',
				'register',
				'company',
				'employeePis',
				'latitude',
				'longitude',
				'type',
				'formRegister',
				'nsr'
			],
			where: {
				employeePis
			},
			order: { register: 'DESC' }
		})

		if (!movements || movements.length === 0) {
			this.logger.warn(`No movements found for employee: ${employeePis}`)
			throw new NotFoundException(
				`Não foram encontrados Movements para o registration Nº ${employeePis}`
			)
		}

		this.logger.debug(
			`Movements found - PIS: ${employeePis}, Count: ${movements.length}`
		)

		return movements
	}

	async update(
		id: string,
		updateMovementDto: UpdateMovementDto
	): Promise<void> {
		this.logger.business(`Updating movement: ${id}`)

		const movement = await this.findOne(id)
		this.movementRepository.merge(movement, updateMovementDto)
		await this.movementRepository.save(movement)

		this.logger.business(`Movement updated successfully: ${id}`)
	}

	async remove(uuid: string): Promise<void> {
		this.logger.business(`Deleting movement: ${uuid}`)

		await this.findOne(uuid)

		this.movementRepository.softDelete({ uuid })
		this.logger.business(`Movement deleted successfully: ${uuid}`)
	}

	async getForRegistration(
		registration: string,
		companyId: any
	): Promise<string> {
		this.logger.debug(
			`Getting PIS for registration: ${registration}, Company: ${companyId}`
		)

		const employee = await this.employeeService.findRegistration(
			registration,
			companyId
		)

		if (!employee) {
			this.logger.warn(
				`Employee not found - Registration: ${registration}, Company: ${companyId}`
			)
			throw new NotFoundException(
				`Não achei um Employee com o registration: ${registration}`
			)
		}

		this.logger.debug(
			`PIS retrieved - Registration: ${registration}, PIS: ${employee.pis}`
		)

		return employee.pis
	}

	async verifyLastMovement(pis: string, now: string) {
		this.logger.debug(`Verifying last movement - PIS: ${pis}, Time: ${now}`)

		return await this.movementRepository
			.createQueryBuilder('movement')
			.where('movement.employeePis = :pis', { pis })
			.andWhere('TIMESTAMPDIFF(MINUTE, movement.register, :now) < 2', { now })
			.orderBy('movement.register', 'DESC')
			.limit(1)
			.getOne()
	}

	private saveImageDirectory(
		createMovementDto: CreateMovementDto,
		image: Express.Multer.File
	) {
		const path = `assets/photos_taken/${
			createMovementDto.employeePis
		}-${moment()
			.tz(createMovementDto.region)
			.format('YYYY-MM-DD HH:mm')
			.replace(':', '')
			.replace(' ', '')}.png`

		fs.writeFileSync(path, image.buffer, 'base64')

		this.logger.debug(
			`Image saved locally - Path: ${path}, PIS: ${createMovementDto.employeePis}`
		)

		return path
	}

	private checkDirectory() {
		const directory = './assets/photos_taken/'

		if (!fs.existsSync(directory)) {
			this.logger.debug(`Creating directory: ${directory}`)
			fs.mkdirSync(directory, { recursive: true })
		}
	}
}

import { Injectable, NotFoundException, HttpException } from '@nestjs/common'
import { CreateMovementDto } from './dto/create-movement.dto'
import { UpdateMovementDto } from './dto/update-movement.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Movement } from './entities/movement.entity'
import { Repository } from 'typeorm'
import { AwsS3Service } from 'src/aws-s3/aws-s3.service'
import * as moment from 'moment-timezone'
import * as fs from 'fs'
import { EmployeesService } from 'src/employees/employees.service'

@Injectable()
export class MovementsService {
	constructor(
		@InjectRepository(Movement)
		private readonly movementRepository: Repository<Movement>,
		private awsS3Service: AwsS3Service,
		private employeeService: EmployeesService
	) {}

	async createMovementPhotoTablet(
		createMovementDto: CreateMovementDto,
		image: Express.Multer.File
	): Promise<any> {
		try {
			const pis = createMovementDto.employeePis
			const now = moment()
				.tz(createMovementDto.region)
				.format('YYYY-MM-DD HH:mm:ss')

			const lastMovement = await this.verifyLastMovement(pis, now)

			if (!lastMovement) {
				this.checkDirectory()

				const path = this.saveImageDirectory(createMovementDto, image)

				createMovementDto.image = path

				const movement = this.movementRepository.create(createMovementDto)
				const response = await this.movementRepository.save(movement)

				return {
					msg: 'Ponto Registrado',
					date: moment().tz(createMovementDto.region).format('DD-MM-YYYY'),
					hour: moment().tz(createMovementDto.region).format('HH:mm'),
					response,
					success: true
				}
			} else {
				return {
					msg: 'Aguarde 2 minutos',
					date: moment(lastMovement.register).format('DD/MM/YYYY'),
					hour: moment(lastMovement.register).format('HH:mm'),
					success: false
				}
			}
		} catch (error) {
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
			const tracks = await this.movementRepository
				.createQueryBuilder('mov')
				.select([
					'mov.uuid',
					'mov.uuid',
					'mov.image',
					'mov.date',
					'mov.register',
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

			return tracks
		} catch (error) {
			throw error
		}
	}

	async create(
		createMovementDto: CreateMovementDto,
		file: Express.Multer.File
	): Promise<Movement> {
		createMovementDto.image = await this.addFile(file)
		const movement = this.movementRepository.create(createMovementDto)

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

		return fileUrl
	}

	async findAll(): Promise<Movement[]> {
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
				'nsr'
			],
			relations: {
				company: true
			}
		})
	}

	async findOne(uuid: string): Promise<Movement> {
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
				'nsr'
			],
			where: { uuid },
			relations: {
				company: true
			}
		})

		if (!uuid) {
			throw new NotFoundException(`Não achei um Company com o uuid ${uuid}`)
		}
		return movement
	}

	async findForRegistration(employeePis: string): Promise<Movement[]> {
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
				'nsr'
			],
			where: {
				employeePis
			},
			order: { register: 'DESC' }
		})

		if (!movements || movements.length === 0) {
			throw new NotFoundException(
				`Não foram encontrados Movements para o registration Nº ${employeePis}`
			)
		}
		return movements
	}

	async update(
		id: string,
		updateMovementDto: UpdateMovementDto
	): Promise<void> {
		const movement = await this.findOne(id)

		this.movementRepository.merge(movement, updateMovementDto)
		await this.movementRepository.save(movement)
	}

	async remove(uuid: string): Promise<void> {
		await this.findOne(uuid)

		if (!uuid) {
			throw new NotFoundException(`Não achei um Company com o id ${uuid}`)
		}
		this.movementRepository.softDelete({ uuid })
	}

	async getForRegistration(
		registration: string,
		companyId: any
	): Promise<string> {
		const employee = await this.employeeService.findRegistration(
			registration,
			companyId
		)

		if (!employee) {
			throw new NotFoundException(
				`Não achei um Employee com o registration: ${registration}`
			)
		}

		return employee.pis
	}

	private async verifyLastMovement(pis: string, now: string) {
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
		const path = `./assets/photos_taken/${
			createMovementDto.employeePis
		}-${moment()
			.tz(createMovementDto.region)
			.format('YYYY-MM-DD HH:mm')
			.replace(':', '')
			.replace(' ', '')}.png`

		fs.writeFileSync(path, image.buffer, 'base64')
		return path
	}

	private checkDirectory() {
		const directory = './assets/photos_taken/'

		if (!fs.existsSync(directory)) {
			console.log('Diretorio criado ')
			fs.mkdirSync(directory, { recursive: true })
		}
	}
}

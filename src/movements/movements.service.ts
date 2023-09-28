import { Injectable, NotFoundException, HttpException } from '@nestjs/common'
import { CreateMovementDto } from './dto/create-movement.dto'
import { UpdateMovementDto } from './dto/update-movement.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Movement } from './entities/movement.entity'
import { Repository } from 'typeorm'
import { AwsS3Service } from 'src/aws-s3/aws-s3.service'
import { EmployeesService } from 'src/employees/employees.service'
import moment from 'moment-timezone'
import * as fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class MovementsService {
	constructor(
		@InjectRepository(Movement)
		private readonly movementRepository: Repository<Movement>,
		private awsS3Service: AwsS3Service,
		private employeeService: EmployeesService
	) {}

	async createMovementQrCode(
		createMovementDto: CreateMovementDto,
		file: Express.Multer.File
	): Promise<Movement> {
		const movement = new Movement()

		const path = `assets/photos_taken/${
			createMovementDto.employeePis
		}-${moment()
			.tz(`${createMovementDto.region}`)
			.format('YYYY-MM-DD HH:mm')
			.replace(':', '')
			.replace(' ', '')}.png`

		fs.writeFileSync(path, file.buffer)

		try {
			movement.employeePis = createMovementDto.employeePis
			movement.date = new Date(
				moment().tz(createMovementDto.region).format('YYYY-MM-DD')
			)
			movement.register = new Date(
				moment().tz(createMovementDto.region).format('YYYY-MM-DD HH:mm:ss')
			)
			movement.image = createMovementDto.image
			movement.company = createMovementDto.company
			movement.latitude = createMovementDto.latitude
			movement.longitude = createMovementDto.longitude
			movement.type = 4
			movement.companieRegister = createMovementDto.companieRegister
			movement.image = path

			const createdMovement = await this.movementRepository.save(movement)
			return createdMovement
		} catch (error) {
			throw error
		}
	}

	async createMovementPhoto(
		createMovementDto: CreateMovementDto,
		image: Express.Multer.File
	): Promise<any> {
		const {
			employeePis,
			latitude,
			longitude,
			company,
			companieRegister,
			region
		} = createMovementDto

		try {
			const now = moment().tz(region).format('YYYY-MM-DD HH:mm:ss')

			const lastMovement = await this.movementRepository
				.createQueryBuilder('movement')
				.where('movement.employeePis = :pis', { employeePis })
				.andWhere('TIMESTAMPDIFF(MINUTE, movement.register, :now) < 2', { now })
				.orderBy('movement.register', 'DESC')
				.limit(1)
				.getOne()

			if (!lastMovement) {
				const path = `assets/photos_taken/${employeePis}-${moment()
					.tz(region)
					.format('YYYY-MM-DD HH:mm')
					.replace(/[:\s]/g, '')}.png`

				fs.writeFileSync(path, image.buffer, 'base64')

				const movement = new Movement()
				movement.uuid = uuidv4()
				movement.employeePis = employeePis
				movement.date = new Date(moment().tz(region).format('YYYY-MM-DD'))
				movement.register = new Date(
					moment().tz(region).format('YYYY-MM-DD HH:mm:ss')
				)
				movement.image = path
				movement.company = company
				movement.latitude = latitude
				movement.longitude = longitude
				movement.type = 3
				movement.companieRegister = companieRegister

				const createdMovement = await this.movementRepository.save(movement)

				return {
					data: 'Ponto Registrado',
					date: moment(createdMovement.register).format('DD/MM/YYYY'),
					hour: moment(createdMovement.register).format('HH:mm')
				}
			} else {
				return {
					data: 'Aguarde 2 minutos \n\n Último ponto registrado:',
					date: moment(lastMovement[0].register).format('DD/MM/YYYY'),
					hour: moment(lastMovement[0].register).format('HH:mm')
				}
			}
		} catch (error) {
			throw error
		}
	}

	async createMovementPhotoTablet(
		createMovementDto: CreateMovementDto,
		image: Express.Multer.File
	): Promise<any> {
		const { employeePis, company, companieRegister, region } = createMovementDto

		try {
			const path = `assets/photos_taken/${employeePis}-${moment()
				.tz(region)
				.format('YYYY-MM-DD HH:mm')
				.replace(':', '')
				.replace(' ', '')}.png`

			fs.writeFileSync(path, image.buffer, 'base64')

			const movement = {
				uuid: uuidv4(),
				employee_pis: employeePis,
				date: moment().tz(region).format('YYYY-MM-DD'),
				register: moment().tz(region).format('YYYY-MM-DD HH:mm:ss'),
				image: path,
				companie_id: company,
				type: 2,
				companie_register: companieRegister
			}

			await this.movementRepository.save(movement)

			return {
				data: 'Ponto Registrado',
				date: moment().tz(region).format('DD/MM/YYYY'),
				hour: moment().tz(region).format('HH:mm')
			}
		} catch (error) {
			throw error
		}
	}

	async getTracks(
		pis: string,
		initialDate: string,
		endDate: string
	): Promise<any[]> {
		try {
			const tracks = await this.movementRepository
				.createQueryBuilder('mov')
				.select(['mov.uuid', 'mov.register as dateFormatted', 'emp.name'])
				.innerJoin('mov.employee', 'employees')
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

	async findForRegistration(registration: string): Promise<Movement[]> {
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
			// where: {
			// 	employee: {
			// 		registration: registration
			// 	}
			// },
			relations: {
				company: true
			}
		})

		if (!movements || movements.length === 0) {
			throw new NotFoundException(
				`Não foram encontrados Movements para o registration Nº ${registration}`
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
}

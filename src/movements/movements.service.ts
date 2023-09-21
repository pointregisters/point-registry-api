import { Injectable, NotFoundException, HttpException } from '@nestjs/common'
import { CreateMovementDto } from './dto/create-movement.dto'
import { UpdateMovementDto } from './dto/update-movement.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Movement } from './entities/movement.entity'
import { Repository } from 'typeorm'
import { AwsS3Service } from 'src/aws-s3/aws-s3.service'
import { EmployeesService } from 'src/employees/employees.service'

@Injectable()
export class MovementsService {
	constructor(
		@InjectRepository(Movement)
		private readonly movementRepository: Repository<Movement>,
		private awsS3Service: AwsS3Service,
		private employeeService: EmployeesService
	) {}

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
		createMovementDto.employee = await this.getEmployee(
			createMovementDto.registration
		)
		const movement = this.movementRepository.create(createMovementDto)

		return await this.movementRepository.save(movement)
	}

	async getEmployee(registration: string) {
		return await this.employeeService.findRegistration(registration)
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
				'id',
				'image',
				'date',
				'register',
				'company',
				'employee',
				'latitude',
				'longitude',
				'type',
				'nsr'
			],
			relations: {
				company: true,
				employee: true
			}
		})
	}

	async findOne(id: string): Promise<Movement> {
		const movement = await this.movementRepository.findOneOrFail({
			select: [
				'id',
				'image',
				'date',
				'register',
				'company',
				'employee',
				'latitude',
				'longitude',
				'type',
				'nsr'
			],
			where: { id },
			relations: {
				company: true,
				employee: true
			}
		})

		if (!id) {
			throw new NotFoundException(`Não achei um Company com o id ${id}`)
		}
		return movement
	}

	async findForRegistration(registration: string): Promise<Movement[]> {
		const movements = await this.movementRepository.find({
			select: [
				'id',
				'image',
				'date',
				'register',
				'company',
				'employee',
				'latitude',
				'longitude',
				'type',
				'nsr'
			],
			where: {
				employee: {
					registration: registration
				}
			},
			relations: {
				company: true,
				employee: true
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

	async remove(id: string): Promise<void> {
		await this.findOne(id)

		if (!id) {
			throw new NotFoundException(`Não achei um Company com o id ${id}`)
		}
		this.movementRepository.softDelete({ id })
	}
}

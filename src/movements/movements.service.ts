import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateMovementDto } from './dto/create-movement.dto'
import { UpdateMovementDto } from './dto/update-movement.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Movement } from './entities/movement.entity'
import { Repository } from 'typeorm'

@Injectable()
export class MovementsService {
	constructor(
		@InjectRepository(Movement)
		private readonly movementRepository: Repository<Movement>
	) {}

	async create(createMovementDto: CreateMovementDto): Promise<Movement> {
		const movement = this.movementRepository.create(createMovementDto)

		return await this.movementRepository.save(movement)
	}

	async findAll(): Promise<Movement[]> {
		return await this.movementRepository.find({
			select: [
				'id',
				'employeePis',
				'date',
				'register',
				'companyId',
				'latitude',
				'longitude',
				'type',
				'companyRegister',
				'nsr'
			]
		})
	}

	async findOne(id: string): Promise<Movement> {
		const movement = await this.movementRepository.findOneOrFail({
			select: [
				'id',
				'employeePis',
				'date',
				'register',
				'companyId',
				'latitude',
				'longitude',
				'type',
				'companyRegister',
				'nsr'
			],
			where: { id }
		})

		if (!id) {
			throw new NotFoundException(`Não achei um Company com o id ${id}`)
		}
		return movement
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

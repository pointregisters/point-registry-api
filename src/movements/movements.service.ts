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

import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete
} from '@nestjs/common'
import { MovementsService } from './movements.service'
import { CreateMovementDto } from './dto/create-movement.dto'
import { UpdateMovementDto } from './dto/update-movement.dto'
import { Movement } from './entities/movement.entity'

@Controller('movements')
export class MovementsController {
	constructor(private readonly movementsService: MovementsService) {}

	@Post()
	async create(
		@Body() createMovementDto: CreateMovementDto
	): Promise<Movement> {
		return await this.movementsService.create(createMovementDto)
	}

	@Get()
	async findAll(): Promise<Movement[]> {
		return await this.movementsService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<Movement> {
		return await this.movementsService.findOne(id)
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateMovementDto: UpdateMovementDto
	): Promise<void> {
		return await this.movementsService.update(id, updateMovementDto)
	}

	@Delete(':id')
	async remove(@Param('id') id: string): Promise<void> {
		return await this.movementsService.remove(id)
	}
}

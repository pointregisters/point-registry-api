import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpCode,
	HttpStatus,
	UseInterceptors,
	UploadedFile,
	UploadedFiles
} from '@nestjs/common'
import { MovementsService } from './movements.service'
import { CreateMovementDto } from './dto/create-movement.dto'
import { UpdateMovementDto } from './dto/update-movement.dto'
import { Movement } from './entities/movement.entity'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import moment from 'moment-timezone'

@Controller('movements')
@ApiTags('Movements')
export class MovementsController {
	constructor(private readonly movementsService: MovementsService) {}

	@Post('/track-qr-code-photo')
	@UseInterceptors(FileInterceptor('image'))
	async trackQRCodePhoto(
		@UploadedFile() image: Express.Multer.File,
		@Body() createMovementDto: CreateMovementDto
	) {
		try {
			const createdMovement = await this.movementsService.createMovement(
				createMovementDto,
				image
			)

			return {
				data: 'Ponto registrado',
				date: moment().tz(`${createMovementDto.region}`).format('DD/MM/YYYY'),
				hour: moment().tz(`${createMovementDto.region}`).format('HH:mm')
			}
		} catch (error) {
			console.error(error)
			throw new Error('Erro ao registrar ponto.')
		}
	}

	@Post()
	@ApiBody({ type: CreateMovementDto })
	@UseInterceptors(FileInterceptor('file'))
	async create(
		@Body() createMovementDto: CreateMovementDto,
		@UploadedFile() file: Express.Multer.File
	): Promise<Movement> {
		return await this.movementsService.create(createMovementDto, file)
	}

	@Post('synchronize')
	@ApiBody({ type: CreateMovementDto })
	@UseInterceptors(FileInterceptor('file'))
	async createBach(
		@Body() createMovementDto: CreateMovementDto,
		@UploadedFile() file: Express.Multer.File
	): Promise<Movement> {
		return await this.movementsService.createBach(createMovementDto, file)
	}

	@Post('batch')
	@ApiBody({ type: [CreateMovementDto], isArray: true })
	@UseInterceptors(FilesInterceptor('file'))
	async createBatch(
		@Body() createMovementDtos: CreateMovementDto[],
		@UploadedFiles() files: Express.Multer.File[]
	): Promise<Movement[]> {
		const movements: Movement[] = []

		for (let i = 0; i < createMovementDtos.length; i++) {
			const movement = await this.create(createMovementDtos[i], files[i])
			movements.push(movement)
		}

		return movements
	}

	@Get()
	async findAll(): Promise<Movement[]> {
		return await this.movementsService.findAll()
	}

	@Get('registration/:registration')
	async findForRegistration(
		@Param('registration') registration: string
	): Promise<Movement[]> {
		return await this.movementsService.findForRegistration(registration)
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<Movement> {
		return await this.movementsService.findOne(id)
	}

	@Patch(':id')
	@ApiBody({ type: UpdateMovementDto })
	async update(
		@Param('id') id: string,
		@Body() updateMovementDto: UpdateMovementDto
	): Promise<void> {
		return await this.movementsService.update(id, updateMovementDto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<void> {
		return await this.movementsService.remove(id)
	}
}

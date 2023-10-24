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
	UploadedFiles,
	Query
} from '@nestjs/common'
import { MovementsService } from './movements.service'
import { CreateMovementDto } from './dto/create-movement.dto'
import { UpdateMovementDto } from './dto/update-movement.dto'
import { Movement } from './entities/movement.entity'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'

@Controller('movements')
@ApiTags('Movements')
export class MovementsController {
	constructor(private readonly movementsService: MovementsService) {}

	@Post('/register-point')
	@UseInterceptors(FileInterceptor('image'))
	async trackPhotoTablet(
		@UploadedFile() image: Express.Multer.File,
		@Body() createMovementDto: CreateMovementDto
	) {
		try {
			const result = await this.movementsService.createMovementPhotoTablet(
				createMovementDto,
				image
			)
			return result
		} catch (error) {
			console.error(error)
			throw new Error('Erro ao registrar ponto pelo tablet.')
		}
	}

	@Post('/synchronize/:employeeRegistration')
	@ApiBody({ type: CreateMovementDto })
	@UseInterceptors(FileInterceptor('image'))
	async createBach(
		@UploadedFile() image: Express.Multer.File,
		@Body() createMovementDto: CreateMovementDto,
		@Param('employeeRegistration') registration: string
	): Promise<Movement> {
		return await this.movementsService.createMovementToRegistration(
			createMovementDto,
			image,
			registration
		)
	}

	@Get('employee-pis/period')
	async getTracks(
		@Query('pis') pis: string,
		@Query('initialDate') initialDate: string,
		@Query('endDate') endDate: string
	): Promise<any[]> {
		try {
			const result = await this.movementsService.getTracks(
				pis,
				initialDate,
				endDate
			)
			return result
		} catch (error) {
			console.error(error)
			throw new Error('Erro ao buscar os registros de ponto.')
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

	@Get('employee-pis/:employeePis')
	async findForRegistration(
		@Param('employeePis') registration: string
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

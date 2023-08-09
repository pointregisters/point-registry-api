import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete
} from '@nestjs/common'
import { TabletsCompaniesService } from './tablets-companies.service'
import { CreateTabletsCompanyDto } from './dto/create-tablets-company.dto'
import { UpdateTabletsCompanyDto } from './dto/update-tablets-company.dto'
import { TabletsCompany } from './entities/tablets-company.entity'

@Controller('tablets-companies')
export class TabletsCompaniesController {
	constructor(
		private readonly tabletsCompaniesService: TabletsCompaniesService
	) {}

	@Post()
	async create(
		@Body() createTabletsCompanyDto: CreateTabletsCompanyDto
	): Promise<TabletsCompany> {
		return await this.tabletsCompaniesService.create(createTabletsCompanyDto)
	}

	@Get()
	async findAll(): Promise<TabletsCompany[]> {
		return await this.tabletsCompaniesService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<TabletsCompany> {
		return await this.tabletsCompaniesService.findOne(+id)
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateTabletsCompanyDto: UpdateTabletsCompanyDto
	): Promise<void> {
		return await this.tabletsCompaniesService.update(
			+id,
			updateTabletsCompanyDto
		)
	}

	@Delete(':id')
	async remove(@Param('id') id: string): Promise<void> {
		return await this.tabletsCompaniesService.remove(+id)
	}
}

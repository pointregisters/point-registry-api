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

@Controller('tablets-companies')
export class TabletsCompaniesController {
	constructor(
		private readonly tabletsCompaniesService: TabletsCompaniesService
	) {}

	@Post()
	create(@Body() createTabletsCompanyDto: CreateTabletsCompanyDto) {
		return this.tabletsCompaniesService.create(createTabletsCompanyDto)
	}

	@Get()
	findAll() {
		return this.tabletsCompaniesService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.tabletsCompaniesService.findOne(+id)
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateTabletsCompanyDto: UpdateTabletsCompanyDto
	) {
		return this.tabletsCompaniesService.update(+id, updateTabletsCompanyDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.tabletsCompaniesService.remove(+id)
	}
}

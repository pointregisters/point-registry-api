import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpCode,
	HttpStatus
} from '@nestjs/common'
import { TabletsCompaniesService } from './tablets-companies.service'
import { CreateTabletsCompanyDto } from './dto/create-tablets-company.dto'
import { UpdateTabletsCompanyDto } from './dto/update-tablets-company.dto'
import { TabletsCompany } from './entities/tablets-company.entity'
import { ApiBody, ApiTags } from '@nestjs/swagger'
@Controller('tablets-companies')
@ApiTags('Tablets-Companies')
export class TabletsCompaniesController {
	constructor(
		private readonly tabletsCompaniesService: TabletsCompaniesService
	) {}

	@Post()
	@ApiBody({ type: CreateTabletsCompanyDto })
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
	@ApiBody({ type: UpdateTabletsCompanyDto })
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
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<void> {
		return await this.tabletsCompaniesService.remove(+id)
	}

	@Get('verify-tablet/:uuid')
	async verifyTablet(@Param('uuid') uuid: string) {
		const result = await this.tabletsCompaniesService.findTabletsCompanyByUuid(
			uuid
		)
		return result
	}

	@Post('/validateTablet')
	async validateTablet(@Body() body: { uuid: string; token: string }) {
		const { uuid, token } = body
		return this.tabletsCompaniesService.validateTablet(uuid, token)
	}
}

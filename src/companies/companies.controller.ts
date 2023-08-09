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
import { CompaniesService } from './companies.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { Company } from './entities/company.entity'
import { ApiBody, ApiTags } from '@nestjs/swagger'

@Controller('companies')
@ApiTags('Companies')
export class CompaniesController {
	constructor(private readonly companiesService: CompaniesService) {}

	@Post()
	@ApiBody({ type: CreateCompanyDto })
	async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
		return await this.companiesService.create(createCompanyDto)
	}

	@Get()
	async findAll(): Promise<Company[]> {
		return await this.companiesService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<Company> {
		return await this.companiesService.findOne(+id)
	}

	@Patch(':id')
	@ApiBody({ type: UpdateCompanyDto })
	async update(
		@Param('id') id: string,
		@Body() updateCompanyDto: UpdateCompanyDto
	): Promise<void> {
		return await this.companiesService.update(+id, updateCompanyDto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<void> {
		return await this.companiesService.remove(+id)
	}
}

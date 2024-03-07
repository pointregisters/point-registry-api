import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post
} from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'

import { CreateEmployeeDto } from './dto/create-employee.dto'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { EmployeesService } from './employees.service'
import { Employee } from './entities/employee.entity'

@Controller('employees')
@ApiTags('Employees')
export class EmployeesController {
	constructor(private readonly employeesService: EmployeesService) {}

	@Get('/verify/:phoneUuid')
	async verify(@Param('phoneUuid') phoneUuid: string) {
		return await this.employeesService.verify(phoneUuid)
	}

	@Post('/validate')
	async validate(@Body() body: { cpf: string; phoneUuid: string }) {
		return this.employeesService.validate(body.cpf, body.phoneUuid)
	}

	@Post()
	@ApiBody({ type: CreateEmployeeDto })
	async create(
		@Body() createEmployeeDto: CreateEmployeeDto
	): Promise<Employee> {
		return await this.employeesService.create(createEmployeeDto)
	}

	@Get()
	async findAll(): Promise<Employee[]> {
		return await this.employeesService.findAll()
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<Employee> {
		return await this.employeesService.findOne(+id)
	}

	@Get(':registration/company/:companyId')
	async findEmployeeByCompany(
		@Param('registration') registration: string,
		@Param('companyId') companyId: number
	): Promise<Employee> {
		return await this.employeesService.findRegistration(registration, companyId)
	}
	@Get('/company/:companyId')
	async findEmployeesByCompanyId(
		@Param('companyId') companyId: number
	): Promise<Employee[]> {
		return await this.employeesService.findEmployeesByCompanyId(companyId)
	}

	@Patch(':id')
	@ApiBody({ type: UpdateEmployeeDto })
	async update(
		@Param('id') id: string,
		@Body() updateEmployeeDto: UpdateEmployeeDto
	): Promise<void> {
		return await this.employeesService.update(+id, updateEmployeeDto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<void> {
		return await this.employeesService.remove(+id)
	}
}

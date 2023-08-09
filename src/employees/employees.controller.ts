import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete
} from '@nestjs/common'
import { EmployeesService } from './employees.service'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { Employee } from './entities/employee.entity'

@Controller('employees')
export class EmployeesController {
	constructor(private readonly employeesService: EmployeesService) {}

	@Post()
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

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateEmployeeDto: UpdateEmployeeDto
	): Promise<void> {
		return await this.employeesService.update(+id, updateEmployeeDto)
	}

	@Delete(':id')
	async remove(@Param('id') id: string): Promise<void> {
		return await this.employeesService.remove(+id)
	}
}

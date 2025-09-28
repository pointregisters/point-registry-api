import {
	Body,
	Controller,
	Delete,
	forwardRef,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Patch,
	Post
} from '@nestjs/common'
import {
	ApiBody,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { DefaultUnauthorizedResponse } from '../common/swagger/DefaultUnauthorizedResponse'
import { DefaultForbiddenResponse } from '../common/swagger/DefaultForbiddenResponse'
import { DefaultInternalServerErrorResponse } from '../common/swagger/DefaultInternalServerErrorResponse'

import { CreateEmployeeDto } from './dto/create-employee.dto'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { EmployeesService } from './employees.service'
import { AuthService } from 'src/auth/auth.service'

import { Employee } from './entities/employee.entity'
import { IsPublic } from 'src/auth/decorators/is-public.decorator'

@Controller('employees')
@ApiTags('Employees')
export class EmployeesController {
	constructor(
		private readonly employeesService: EmployeesService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService
	) {}

	@Post('/verify')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async verify(@Body() body: { phoneUuid: string }) {
		const employeeData = await this.employeesService.verify(body.phoneUuid)

		// Se encontrou o employee e está autorizado, gere o token
		if (employeeData && employeeData.id) {
			// Crie um objeto Employee mock para o login (ou ajuste conforme sua estrutura)
			const mockEmployee: Employee = {
				id: employeeData.id,
				email: employeeData.email || '', // Ajuste conforme necessário
				registration: employeeData.registration
				// Adicione outras propriedades necessárias
			} as Employee

			const token = await this.authService.login(mockEmployee)
			return {
				...employeeData,
				token: token.access_token
			}
		}

		return employeeData
	}

	@IsPublic()
	@Post('/validate')
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async validate(@Body() body: { cpf: string; phoneUuid: string }) {
		const validationResult = await this.employeesService.validate(
			body.cpf,
			body.phoneUuid
		)
		// Se a validação foi bem-sucedida e encontrou um employee, gere o token
		if (
			validationResult &&
			validationResult.id &&
			validationResult.status !== 'NOT_FOUND'
		) {
			// Crie um objeto Employee mock para o login
			const mockEmployee: Employee = {
				id: validationResult.id,
				email: validationResult.email || '', // Ajuste conforme necessário
				registration: validationResult.registration
				// Adicione outras propriedades necessárias
			} as Employee

			const token = await this.authService.login(mockEmployee)
			return {
				...validationResult,
				token: token.access_token
			}
		}

		return validationResult
	}

	@Post()
	@ApiBody({ type: CreateEmployeeDto })
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async create(
		@Body() createEmployeeDto: CreateEmployeeDto
	): Promise<Employee> {
		return await this.employeesService.create(createEmployeeDto)
	}

	@Get()
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async findAll(): Promise<Employee[]> {
		return await this.employeesService.findAll()
	}

	@Get(':id')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async findOne(@Param('id') id: string): Promise<Employee> {
		return await this.employeesService.findOne(+id)
	}

	@Get(':registration/company/:companyId')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async findEmployeeByCompany(
		@Param('registration') registration: string,
		@Param('companyId') companyId: number
	): Promise<Employee> {
		return await this.employeesService.findRegistration(registration, companyId)
	}
	@Get('/company/:companyId')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async findEmployeesByCompanyId(
		@Param('companyId') companyId: number
	): Promise<Employee[]> {
		return await this.employeesService.findEmployeesByCompanyId(companyId)
	}

	@Patch(':id')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	@ApiBody({ type: UpdateEmployeeDto })
	async update(
		@Param('id') id: string,
		@Body() updateEmployeeDto: UpdateEmployeeDto
	): Promise<void> {
		return await this.employeesService.update(+id, updateEmployeeDto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async remove(@Param('id') id: string): Promise<void> {
		return await this.employeesService.remove(+id)
	}
}

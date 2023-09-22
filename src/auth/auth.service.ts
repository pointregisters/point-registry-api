import { Injectable } from '@nestjs/common'
import { CreateAuthDto } from './dto/create-auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { TabletsCompaniesService } from 'src/tablets-companies/tablets-companies.service'
import { TabletsCompany } from 'src/tablets-companies/entities/tablets-company.entity'
import { EmployeesService } from 'src/employees/employees.service'
import { Employee } from 'src/employees/entities/employee.entity'

@Injectable()
export class AuthService {
	constructor(
		private readonly tabletsCompaniesService: TabletsCompaniesService,
		private readonly employeeService: EmployeesService
	) {}

	create(createAuthDto: CreateAuthDto) {
		return 'This action adds a new auth'
	}

	findAll() {
		return `This action returns all auth`
	}

	findOne(id: number) {
		return `This action returns a #${id} auth`
	}

	update(id: number, updateAuthDto: UpdateAuthDto) {
		return `This action updates a #${id} auth`
	}

	remove(id: number) {
		return `This action removes a #${id} auth`
	}

	async loginForToken(token: string): Promise<TabletsCompany> {
		return await this.tabletsCompaniesService.findToken(token)
	}
	async loginForRegistration(registration: string): Promise<Employee> {
		return await this.employeeService.findRegistration(registration)
	}
}
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { Employee } from './entities/employee.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class EmployeesService {
	constructor(
		@InjectRepository(Employee)
		private readonly employeeRepository: Repository<Employee>
	) {}

	async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
		const employee = this.employeeRepository.create(createEmployeeDto)

		return await this.employeeRepository.save(employee)
	}

	async findAll(): Promise<Employee[]> {
		return await this.employeeRepository.find({
			select: [
				'id',
				'image',
				'pis',
				'name',
				'registration',
				'companyId',
				'contract',
				'phoneUuid',
				'phoneStatus',
				'matriz',
				'token'
			]
		})
	}

	async findOne(id: number): Promise<Employee> {
		const User = await this.employeeRepository.findOneOrFail({
			select: [
				'id',
				'image',
				'pis',
				'name',
				'registration',
				'companyId',
				'contract',
				'phoneUuid',
				'phoneStatus',
				'matriz',
				'token'
			],
			where: { id }
		})

		if (!id) {
			throw new NotFoundException(`Não achei um Employee com o id ${id}`)
		}
		return User
	}

	async update(
		id: number,
		updateEmployeeDto: UpdateEmployeeDto
	): Promise<void> {
		const employee = await this.findOne(id)

		this.employeeRepository.merge(employee, updateEmployeeDto)
		await this.employeeRepository.save(employee)
	}

	async remove(id: number): Promise<void> {
		await this.findOne(id)

		if (!id) {
			throw new NotFoundException(`Não achei um Employee com o id ${id}`)
		}
		this.employeeRepository.softDelete({ id })
	}
}

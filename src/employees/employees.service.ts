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
				'company',
				'contract',
				'phoneUuid',
				'phoneStatus',
				'matriz',
				// 'movements'
				'token'
			],
			relations: {
				// movements: true,
				company: true
			}
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
				'company',
				'contract',
				'phoneUuid',
				'phoneStatus',
				'matriz',
				'token'
			],
			where: { id },
			relations: {
				company: true
			}
		})

		if (!id) {
			throw new NotFoundException(`Não achei um Employee com o id ${id}`)
		}
		return User
	}

	async findRegistration(registration: string): Promise<Employee> {
		const User = await this.employeeRepository.findOneOrFail({
			select: [
				'id',
				'image',
				'pis',
				'name',
				'registration',
				'company',
				'contract',
				'phoneUuid',
				'phoneStatus',
				'matriz',
				'token'
			],
			where: { registration },
			relations: {
				company: true
			}
		})

		if (!registration) {
			throw new NotFoundException(
				`Não achei um Employee com o registration ${registration}`
			)
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

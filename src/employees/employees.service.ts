import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { Employee } from './entities/employee.entity'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Company } from 'src/companies/entities/company.entity'

@Injectable()
export class EmployeesService {
	constructor(
		@InjectRepository(Employee)
		private readonly employeeRepository: Repository<Employee>
	) {}

	async verify(phoneUuid: string): Promise<any> {
		try {
			const queryBuilder: SelectQueryBuilder<Employee> = this.employeeRepository
				.createQueryBuilder('colab')
				.select([
					'colab.ponto_celular',
					'colab.name',
					'region.description',
					'colab.ponto_qrcode',
					'colab.id AS colaborador_id',
					'colab.pis AS pis',
					'colab.company',
					'colab.contract'
				])
				.leftJoin('companies', 'comp', 'comp.id = colab.contract')
				.leftJoin('region', 'region', 'region.id = comp.region_id')
				.where('colab.phone_uuid = :phoneUuid', { phoneUuid })
				.andWhere(
					'(colab.ponto_qrcode = 1 OR colab.ponto_celular = 1 OR colab.ponto_biometria = 1 OR colab.ponto_matricula = 1)'
				)
				.andWhere('colab.phone_status = 1')
				.andWhere('colab.status = 1')

			const result = await queryBuilder.getRawMany()

			if (result.length > 0) {
				let type
				if (result[0].ponto_celular == 1 && result[0].ponto_qrcode == 0) {
					type = 0
				} else if (
					result[0].ponto_celular == 0 &&
					result[0].ponto_qrcode == 1
				) {
					type = 1
				} else if (
					result[0].ponto_celular == 1 &&
					result[0].ponto_qrcode == 1
				) {
					type = 3
				} else {
					type = null
				}
				return { ready: true, data: result, type }
			}
			return { ready: false }
		} catch (error) {
			throw new Error('Failed to execute the query: ' + error.message)
		}
	}

	async validate(cpfOrPis: string, phoneUuid: string) {
		const queryBuilder: SelectQueryBuilder<Employee> = this.employeeRepository
			.createQueryBuilder('colab')
			.select([
				'colab.ponto_celular',
				'colab.name',
				'region.description',
				'colab.ponto_qrcode',
				'colab.id AS colaborador_id',
				'colab.pis AS pis',
				'colab.company',
				'colab.contract'
			])
			.leftJoin('companies', 'comp', 'comp.id = colab.contract')
			.leftJoin('region', 'region', 'region.id = comp.region_id')
			.where('(colab.cpf = :cpfOrPis OR colab.pis = :cpfOrPis)', { cpfOrPis })
			.andWhere(
				'(colab.ponto_qrcode = 1 OR colab.ponto_celular = 1 OR colab.ponto_biometria = 1 OR colab.ponto_matricula = 1)'
			)
			.andWhere('colab.phone_status = 0')
			.andWhere('colab.status = 1')

		const employee = await queryBuilder.getOne()

		if (employee) {
			employee.phoneUuid = phoneUuid
			employee.phoneStatus = 1
			await this.employeeRepository.save(employee)

			let type = null
			if (employee.pontoCelular === 1 && employee.pontoQrcode === 0) {
				type = 0
			} else if (employee.pontoCelular === 0 && employee.pontoQrcode === 1) {
				type = 1
			} else if (employee.pontoCelular === 1 && employee.pontoQrcode === 1) {
				type = 3
			}

			return { ready: true, data: employee, type }
		} else {
			const employeeWithPhoneStatus = await queryBuilder
				.clone()
				.andWhere('colab.phone_status = 1')
				.getOne()

			if (employeeWithPhoneStatus) {
				return { ready: false, status: 'EXISTS' }
			} else {
				return { ready: false, status: 'NOT_FOUND' }
			}
		}
	}

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
				'status'
			],
			relations: {
				company: true
			}
		})
	}

	async findOne(id: number): Promise<Employee> {
		const User = await this.employeeRepository.findOne({
			// select: [
			// 	'id',
			// 	'image',
			// 	'pis',
			// 	'name',
			// 	'registration',
			// 	'company',
			// 	'contract',
			// 	'phoneUuid',
			// 	'phoneStatus',
			// 	'status'
			// ],
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

	async findRegistration(
		registration: string,
		companyId: number
	): Promise<Employee> {
		const User = this.employeeRepository
			.createQueryBuilder('employee')
			.select([
				'employee.id as id',
				'employee.image as image',
				'employee.pis as pis',
				'employee.name as name',
				'employee.registration as registration',
				'employee.company as company',
				'employee.contract as contract',
				'employee.phoneUuid as phoneUuid',
				'employee.phoneStatus as phoneStatus',
				'employee.status as status'
			])
			.where('employee.registration = :registration', { registration })
			.andWhere('employee.company = :companyId', { companyId })
			.getRawOne()

		if (!User) {
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

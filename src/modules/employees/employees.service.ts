import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Region } from 'src/modules/region/entities/region.entity'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { CreateEmployeeDto } from './dto/create-employee.dto'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { Employee } from './entities/employee.entity'

@Injectable()
export class EmployeesService {
	constructor(
		@InjectRepository(Employee)
		private readonly employeeRepository: Repository<Employee>,
		@InjectRepository(Region)
		private readonly regionRepository: Repository<Region>
	) {}

	async validate(cpf: string, phoneMei: string) {
		try {
			const employee = await this.employeeRepository.findOne({
				where: [
					{ cpf: cpf, pontoCelular: 1, status: 1, phoneStatus: 0 },
					{ cpf: cpf, pontoQrcode: 1, status: 1, phoneStatus: 0 }
				],
				relations: {
					company: true
				}
			})

			const region = await this.regionRepository
				.createQueryBuilder('region')
				.leftJoin('companies', 'c', 'c.region_id = region.id')
				.leftJoin('tablets_companies', 'tc', 'tc.companie_id = c.id')
				.getOne()

			if (employee) {
				const combinedIdentifier = `${cpf}-${phoneMei}`
				const encryptedPhoneUuid = bcrypt.hashSync(combinedIdentifier, 10)

				employee.phoneUuid = encryptedPhoneUuid
				employee.phoneStatus = 1

				// Save the updated employee
				await this.employeeRepository.save(employee)

				const {
					id,
					name,
					email,
					company,
					pis,
					registration,
					pontoCelular,
					pontoQrcode,
					pontoBiometria,
					pontoMatricula,
					phoneUuid,
					phoneStatus
				} = employee

				return {
					id,
					name,
					email,
					pis,
					registration,
					pontoCelular,
					pontoQrcode,
					pontoBiometria,
					pontoMatricula,
					phoneUuid,
					phoneStatus,
					regionDescription: region.description,
					company
				}
			} else {
				const employeeWithPhoneStatus = await this.employeeRepository.findOne({
					where: [
						{ cpf: cpf, pontoCelular: 1, status: 1, phoneStatus: 1 },
						{ cpf: cpf, pontoQrcode: 1, status: 1, phoneStatus: 1 }
					],
					relations: {
						company: true
					}
				})

				if (employeeWithPhoneStatus) {
					const {
						id,
						name,
						email,
						company,
						pis,
						registration,
						pontoCelular,
						pontoQrcode,
						pontoBiometria,
						pontoMatricula,
						phoneUuid,
						phoneStatus
					} = employeeWithPhoneStatus

					const combinedIdentifier = `${cpf}-${phoneMei}`
					if (bcrypt.compareSync(combinedIdentifier, phoneUuid)) {
						return {
							status: 'AUTHORIZED',
							id,
							name,
							email,
							pis,
							registration,
							pontoCelular,
							pontoQrcode,
							pontoBiometria,
							pontoMatricula,
							phoneUuid,
							phoneStatus,
							regionDescription: region.description,
							company
						}
					}

					return {
						status: 'EXISTS',
						id,
						name,
						email,
						pis,
						registration,
						pontoCelular,
						pontoQrcode,
						pontoBiometria,
						pontoMatricula,
						phoneUuid,
						phoneStatus,
						regionDescription: region.description,
						company
					}
				} else {
					return {
						ready: false,
						status: 'NOT_FOUND'
					}
				}
			}
		} catch (error) {
			throw new Error('Failed to execute the query: ' + error.message)
		}
	}

	async verify(phoneUuid: string): Promise<any> {
		try {
			const queryBuilder: SelectQueryBuilder<Employee> = this.employeeRepository
				.createQueryBuilder('colab')
				.select([
					'colab.id AS id',
					'colab.name AS name',
					'colab.pis AS pis',
					'colab.registration AS registration',
					'colab.email AS email',
					'colab.ponto_celular AS pontoCelular',
					'colab.ponto_qrcode AS pontoQrcode',
					'colab.ponto_biometria AS pontoBiometria',
					'colab.ponto_matricula AS pontoMatricula',
					'colab.company AS companyId',
					'region.description AS regionDescription '
				])
				.leftJoin('companies', 'comp', 'comp.id = colab.contract')
				.leftJoin('region', 'region', 'region.id = comp.region_id')
				.where('colab.phone_uuid = :phoneUuid', { phoneUuid })
				.andWhere('colab.phone_status = 1')
				.andWhere('colab.status = 1')

			const result = await queryBuilder.getRawOne()

			if (result) {
				return result
			}
			return { ready: false }
		} catch (error) {
			throw new Error('Failed to execute the query: ' + error.message)
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
		const User = await this.employeeRepository
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

	async findEmployeesByCompanyId(companyId: number): Promise<Employee[]> {
		const User = this.employeeRepository
			.createQueryBuilder('employee')
			.select([
				'employee.id as id',
				'employee.pis as pis',
				'employee.name as name',
				'employee.registration as registration',
				'employee.status as status'
			])
			.where('employee.companie_id = :companyId', { companyId })
			.andWhere('employee.status = 1')
			.getRawMany()

		if (!User) {
			throw new NotFoundException(
				`Não achei um Employees com o CompanyId: ${companyId}`
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

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Region } from 'src/modules/region/entities/region.entity'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { CustomLogger } from 'src/modules/common/logger/custom-logger.service'

import { CreateEmployeeDto } from './dto/create-employee.dto'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { Employee } from './entities/employee.entity'

@Injectable()
export class EmployeesService {
	constructor(
		@InjectRepository(Employee)
		private readonly employeeRepository: Repository<Employee>,
		@InjectRepository(Region)
		private readonly regionRepository: Repository<Region>,
		private readonly logger: CustomLogger
	) {
		this.logger.setContext('EmployeesService')
	}

	async validate(cpf: string, phoneMei: string) {
		const startTime = Date.now()

		try {
			this.logger.business('Starting employee validation', {
				cpf,
				phoneMei
			})

			this.logger.debug(`Searching employee with CPF: ${cpf}`)

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
				this.logger.business('Employee found - generating phone UUID', {
					employeeId: employee.id,
					name: employee.name
				})

				const combinedIdentifier = `${cpf}-${phoneMei}`
				const encryptedPhoneUuid = bcrypt.hashSync(combinedIdentifier, 10)

				employee.phoneUuid = encryptedPhoneUuid
				employee.phoneStatus = 1

				await this.employeeRepository.save(employee)

				this.logger.business('Employee phone UUID generated and saved', {
					employeeId: employee.id,
					phoneStatus: 'activated'
				})

				const processingTime = Date.now() - startTime
				this.logger.business('Employee validation completed successfully', {
					employeeId: employee.id,
					status: 'NEW_DEVICE',
					processingTime: `${processingTime}ms`
				})

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
				this.logger.debug(
					'Employee not found with phoneStatus 0, searching with phoneStatus 1'
				)

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
					this.logger.business('Employee found with existing phone UUID', {
						employeeId: employeeWithPhoneStatus.id,
						name: employeeWithPhoneStatus.name
					})

					const combinedIdentifier = `${cpf}-${phoneMei}`
					const isUuidValid = bcrypt.compareSync(
						combinedIdentifier,
						employeeWithPhoneStatus.phoneUuid
					)

					const processingTime = Date.now() - startTime

					if (isUuidValid) {
						this.logger.business('Phone UUID validation successful', {
							employeeId: employeeWithPhoneStatus.id,
							status: 'AUTHORIZED',
							processingTime: `${processingTime}ms`
						})

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

					this.logger.warn('Phone UUID validation failed', {
						employeeId: employeeWithPhoneStatus.id,
						status: 'EXISTS',
						processingTime: `${processingTime}ms`
					})

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
					this.logger.warn('Employee not found in system', {
						cpf,
						status: 'NOT_FOUND',
						processingTime: `${Date.now() - startTime}ms`
					})

					return {
						ready: false,
						status: 'NOT_FOUND'
					}
				}
			}
		} catch (error) {
			const processingTime = Date.now() - startTime

			this.logger.error(
				`Error validating employee - CPF: ${cpf} - ${error.message}`,
				error.stack,
				'EmployeesService'
			)

			this.logger.business('Employee validation failed', {
				cpf,
				error: error.message,
				processingTime: `${processingTime}ms`
			})

			throw new Error('Failed to execute the query: ' + error.message)
		}
	}

	async verify(phoneUuid: string): Promise<any> {
		const startTime = Date.now()

		try {
			this.logger.business('Starting employee verification by phone UUID', {
				phoneUuid: phoneUuid.substring(0, 10) + '...' // Log parcial por segurança
			})

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

			const processingTime = Date.now() - startTime

			if (result) {
				this.logger.business('Employee verification successful', {
					employeeId: result.id,
					name: result.name,
					processingTime: `${processingTime}ms`
				})

				return result
			}

			this.logger.warn('Employee verification failed - not found or inactive', {
				phoneUuid: phoneUuid,
				processingTime: `${processingTime}ms`
			})

			return { ready: false }
		} catch (error) {
			const processingTime = Date.now() - startTime

			this.logger.error(
				`Error verifying employee - PhoneUUID: ${phoneUuid.substring(0, 10)}... - ${error.message}`,
				error.stack,
				'EmployeesService'
			)

			this.logger.business('Employee verification failed', {
				phoneUuid: phoneUuid.substring(0, 10) + '...',
				error: error.message,
				processingTime: `${processingTime}ms`
			})

			throw new Error('Failed to execute the query: ' + error.message)
		}
	}

	async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
		const startTime = Date.now()

		try {
			this.logger.business('Creating new employee', {
				name: createEmployeeDto.name,
				registration: createEmployeeDto.registration,
				company: createEmployeeDto.company
			})

			const employee = this.employeeRepository.create(createEmployeeDto)
			const result = await this.employeeRepository.save(employee)

			const processingTime = Date.now() - startTime

			this.logger.business('Employee created successfully', {
				employeeId: result.id,
				name: result.name,
				processingTime: `${processingTime}ms`
			})

			return result
		} catch (error) {
			const processingTime = Date.now() - startTime

			this.logger.error(
				`Error creating employee - ${error.message}`,
				error.stack,
				'EmployeesService'
			)

			this.logger.business('Employee creation failed', {
				name: createEmployeeDto.name,
				error: error.message,
				processingTime: `${processingTime}ms`
			})

			throw error
		}
	}

	async findAll(): Promise<Employee[]> {
		this.logger.debug('Finding all employees')

		const employees = await this.employeeRepository.find({
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

		this.logger.debug(`Found ${employees.length} employees`)

		return employees
	}

	async findOne(id: number): Promise<Employee> {
		this.logger.debug(`Finding employee by ID: ${id}`)

		const employee = await this.employeeRepository.findOne({
			where: { id },
			relations: {
				company: true
			}
		})

		if (!employee) {
			this.logger.warn(`Employee not found: ${id}`)
			throw new NotFoundException(`Não achei um Employee com o id ${id}`)
		}

		this.logger.debug(`Employee found: ${employee.name} (ID: ${id})`)

		return employee
	}

	async findRegistration(
		registration: string,
		companyId: number
	): Promise<Employee> {
		this.logger.debug(
			`Finding employee by registration: ${registration}, company: ${companyId}`
		)

		const employee = await this.employeeRepository
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

		if (!employee) {
			this.logger.warn(
				`Employee not found - Registration: ${registration}, Company: ${companyId}`
			)
			throw new NotFoundException(
				`Não achei um Employee com o registration ${registration}`
			)
		}

		this.logger.debug(
			`Employee found by registration: ${employee.name} (Registration: ${registration})`
		)

		return employee
	}

	async findEmployeesByCompanyId(companyId: number): Promise<Employee[]> {
		this.logger.debug(`Finding employees by company ID: ${companyId}`)

		const employees = await this.employeeRepository
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

		if (!employees || employees.length === 0) {
			this.logger.warn(`No employees found for company ID: ${companyId}`)
			throw new NotFoundException(
				`Não achei Employees com o CompanyId: ${companyId}`
			)
		}

		this.logger.debug(
			`Found ${employees.length} employees for company ID: ${companyId}`
		)

		return employees
	}

	async update(
		id: number,
		updateEmployeeDto: UpdateEmployeeDto
	): Promise<void> {
		this.logger.business(`Updating employee: ${id}`)

		const employee = await this.findOne(id)
		this.employeeRepository.merge(employee, updateEmployeeDto)
		await this.employeeRepository.save(employee)

		this.logger.business(`Employee updated successfully: ${id}`)
	}

	async remove(id: number): Promise<void> {
		this.logger.business(`Deleting employee: ${id}`)

		await this.findOne(id)
		this.employeeRepository.softDelete({ id })

		this.logger.business(`Employee deleted successfully: ${id}`)
	}
}

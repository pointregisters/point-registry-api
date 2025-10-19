import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTabletsCompanyDto } from './dto/create-tablets-company.dto'
import { UpdateTabletsCompanyDto } from './dto/update-tablets-company.dto'
import { TabletsCompany } from './entities/tablets-company.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as moment from 'moment-timezone'
import { Movement } from 'src/modules/movements/entities/movement.entity'
import { Region } from 'src/modules/region/entities/region.entity'
import { v4 as uuidv4 } from 'uuid'
@Injectable()
export class TabletsCompaniesService {
	constructor(
		@InjectRepository(TabletsCompany)
		private readonly tabletsCompanyRepository: Repository<TabletsCompany>,
		@InjectRepository(Movement)
		private readonly movementRepository: Repository<Movement>,
		@InjectRepository(Region)
		private readonly regionRepository: Repository<Region>
	) {}

	async findTabletsCompanyByUuid(uuid: string) {
		return this.tabletsCompanyRepository
			.createQueryBuilder('tc')
			.select([
				'tc.id as id',
				'tc.companyId as companyId',
				'tc.matriz as matriz',
				'tc.token as token',
				'tc.terminal as terminal',
				'tc.uuid as uuid',
				'tc.status as status',
				'tc.dataInstalacao as dataInstalacao'
			])
			.leftJoin('companies', 'c', 'c.id = tc.companyId')
			.leftJoin('region', 'r', 'r.id = c.region_id')
			.where('tc.uuid = :uuid', { uuid })
			.andWhere('tc.status = :status', { status: 1 })
			.addSelect('r.description as region')
			.getRawOne()
	}

	async validateTablet(uuid: string, token: string): Promise<TabletsCompany> {
		try {
			const tablet = await this.tabletsCompanyRepository
				.createQueryBuilder()
				.select(['tc', 'r.description AS region'])
				.from(TabletsCompany, 'tc')
				.leftJoin('companies', 'c', 'c.id = tc.companyId')
				.leftJoin('region', 'r', 'r.id = c.region_id')
				.where('tc.token = :token', { token })
				.andWhere('tc.status = 0')
				.getOne()

			const region = await this.regionRepository
				.createQueryBuilder('region')
				.leftJoin('companies', 'c', 'c.region_id = region.id')
				.leftJoin('tablets_companies', 'tc', 'tc.companie_id = c.id')
				.where('tc.token = :token', { token })
				.getOne()

			if (tablet) {
				tablet.uuid = uuidv4()
				tablet.status = true
				tablet.dataInstalacao = new Date(
					moment().tz(`${region.description}`).format('YYYY-MM-DD HH:mm:ss')
				)

				// Save the updated tablet
				await this.tabletsCompanyRepository.save(tablet)

				return tablet
			} else {
				throw new NotFoundException(
					`Não achei um TabletsCompany com o token ${token}`
				)
			}
		} catch (error) {
			throw new Error('Failed to execute the query: ' + error.message)
		}
	}

	async validateID(id: string, token: string, region: string): Promise<any> {
		try {
			const tabletCompany = await this.tabletsCompanyRepository
				.createQueryBuilder('tc')
				.select(['tc.companie_id', 'tc.matriz'])
				.addSelect(['emp.*'])
				.innerJoin('employees', 'emp', 'emp.matriz = tc.matriz')
				.where('tc.token = :token', { token })
				.andWhere('emp.registration = :id', { id })
				.andWhere('emp.status = 1')
				.andWhere('emp.ponto_matricula = 1')
				.getOne()

			if (tabletCompany) {
				const lastMovement = await this.movementRepository
					.createQueryBuilder('movement')
					// .where('movement.employee_pis = :pis', { pis: tabletCompany.pis })
					.andWhere('TIMESTAMPDIFF(MINUTE, movement.register, :now) < 2', {
						now: moment().tz(region).format('YYYY-MM-DD HH:mm:ss')
					})
					.orderBy('movement.register', 'DESC')
					.limit(1)
					.getOne()

				if (!lastMovement) {
					return { status: 'success', employee: tabletCompany }
				} else {
					return {
						status: 'hold',
						uuid: tabletCompany.uuid,
						data: 'Aguarde 2 minutos \n\n Último ponto registrado:',
						date: moment(lastMovement.register).format('DD/MM/YYYY'),
						hour: moment(lastMovement.register).format('HH:mm')
					}
				}
			} else {
				return { status: 'error' }
			}
		} catch (error) {
			throw error
		}
	}

	async create(
		createTabletsCompanyDto: CreateTabletsCompanyDto
	): Promise<TabletsCompany> {
		const tabletsCompany = this.tabletsCompanyRepository.create(
			createTabletsCompanyDto
		)

		return await this.tabletsCompanyRepository.save(tabletsCompany)
	}

	async findAll(): Promise<TabletsCompany[]> {
		return await this.tabletsCompanyRepository.find({
			select: [
				'id',
				'companyId',
				'matriz',
				'terminal',
				'uuid',
				'status',
				'dataInstalacao',
				'token'
			]
			// relations: {
			// 	companyId: true
			// }
		})
	}

	async findOne(id: number): Promise<TabletsCompany> {
		const tabletsCompany = await this.tabletsCompanyRepository.findOne({
			select: [
				'id',
				'companyId',
				'matriz',
				'terminal',
				'uuid',
				'status',
				'dataInstalacao',
				'token'
			],
			where: { id }
		})

		// const tabletsCompany = await this.tabletsCompanyRepository
		// 	.createQueryBuilder('tablets_companies')
		// 	.leftJoin('companies', 'c', 'c.id = tablets_companies.companie_id')
		// 	.where('tablets_companies.id = :id', { id })
		// 	.addSelect('c.*')
		// 	.getOne()

		if (!tabletsCompany) {
			throw new NotFoundException(`Não achei um TabletsCompany com o id ${id}`)
		}
		return tabletsCompany
	}

	async findToken(token: string): Promise<TabletsCompany> {
		const tabletsCompany = await this.tabletsCompanyRepository.findOneOrFail({
			select: [
				'id',
				'companyId',
				'matriz',
				'terminal',
				'uuid',
				'status',
				'dataInstalacao',
				'token'
			],
			where: { token }
			// relations: {
			// 	companyId: true
			// }
		})

		if (!token) {
			throw new NotFoundException(
				`Não achei um TabletsCompany com o token ${token}`
			)
		}
		return tabletsCompany
	}

	async update(
		id: number,
		updateTabletsCompanyDto: UpdateTabletsCompanyDto
	): Promise<void> {
		const tabletsCompany = await this.findOne(id)

		this.tabletsCompanyRepository.merge(tabletsCompany, updateTabletsCompanyDto)
		await this.tabletsCompanyRepository.save(tabletsCompany)
	}

	async remove(id: number): Promise<void> {
		await this.findOne(id)

		if (!id) {
			throw new NotFoundException(`Não achei um TabletsCompany com o id ${id}`)
		}
		this.tabletsCompanyRepository.softDelete({ id })
	}
}

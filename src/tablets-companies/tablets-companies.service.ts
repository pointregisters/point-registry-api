import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTabletsCompanyDto } from './dto/create-tablets-company.dto'
import { UpdateTabletsCompanyDto } from './dto/update-tablets-company.dto'
import { TabletsCompany } from './entities/tablets-company.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import moment from 'moment-timezone'

@Injectable()
export class TabletsCompaniesService {
	constructor(
		@InjectRepository(TabletsCompany)
		private readonly tabletsCompanyRepository: Repository<TabletsCompany>
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

	async validateTablet(uuid: string, token: string): Promise<any> {
		try {
			const result = await this.tabletsCompanyRepository
				.createQueryBuilder()
				.select(['tc', 'r.description AS region'])
				.from(TabletsCompany, 'tc')
				.innerJoin('tc.company', 'c')
				.leftJoin('c.region', 'r')
				.where('tc.token = :token', { token })
				.andWhere('tc.status = 0')
				.getRawMany()

			if (result.length > 0) {
				const tablet = result[0]
				tablet.uuid = uuid
				tablet.status = 1
				tablet.data_instalacao = moment()
					.tz(tablet.region)
					.format('YYYY-MM-DD HH:mm:ss')

				// Save the updated tablet
				await this.tabletsCompanyRepository.save(tablet)

				return { ready: true, data: tablet }
			} else {
				return { ready: false }
			}
		} catch (error) {
			throw new Error('Failed to execute the query: ' + error.message)
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
			where: { id }
			// relations: {
			// 	companyId: true
			// }
		})

		if (!id) {
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

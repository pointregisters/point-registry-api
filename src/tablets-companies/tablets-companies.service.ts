import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTabletsCompanyDto } from './dto/create-tablets-company.dto'
import { UpdateTabletsCompanyDto } from './dto/update-tablets-company.dto'
import { TabletsCompany } from './entities/tablets-company.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class TabletsCompaniesService {
	constructor(
		@InjectRepository(TabletsCompany)
		private readonly tabletsCompanyRepository: Repository<TabletsCompany>
	) {}

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
				'company',
				'matriz',
				'terminal',
				'uuid',
				'status',
				'dataInstalacao',
				'token'
			],
			relations: {
				company: true
			}
		})
	}

	async findOne(id: number): Promise<TabletsCompany> {
		const tabletsCompany = await this.tabletsCompanyRepository.findOneOrFail({
			select: [
				'id',
				'company',
				'matriz',
				'terminal',
				'uuid',
				'status',
				'dataInstalacao',
				'token'
			],
			where: { id },
			relations: {
				company: true
			}
		})

		if (!id) {
			throw new NotFoundException(`Não achei um TabletsCompany com o id ${id}`)
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

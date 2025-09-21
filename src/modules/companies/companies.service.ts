import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Company } from './entities/company.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CompaniesService {
	constructor(
		@InjectRepository(Company)
		private readonly companyRepository: Repository<Company>
	) {}

	async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
		const employee = this.companyRepository.create(createCompanyDto)

		return await this.companyRepository.save(employee)
	}

	async findAll(): Promise<Company[]> {
		return await this.companyRepository.find({
			select: [
				'id',
				'name',
				'cnpj',
				'type',
				'matriz',
				'dateContrato',
				'email',
				'login',
				'senha',
				'regionId'
			]
		})
	}

	async findOne(id: number): Promise<Company> {
		const User = await this.companyRepository.findOne({
			select: [
				'id',
				'name',
				'cnpj',
				'type',
				'matriz',
				'status',
				'email',
				'local',
				'regionId',
				'nomeFantasia'
			],
			where: { id }
		})

		if (!id) {
			throw new NotFoundException(`Não achei um Company com o id ${id}`)
		}
		return User
	}

	async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<void> {
		const company = await this.findOne(id)

		this.companyRepository.merge(company, updateCompanyDto)
		await this.companyRepository.save(company)
	}

	async remove(id: number): Promise<void> {
		await this.findOne(id)

		if (!id) {
			throw new NotFoundException(`Não achei um Company com o id ${id}`)
		}
		this.companyRepository.softDelete({ id })
	}
}

import { Injectable } from '@nestjs/common'
import { CreateTabletsCompanyDto } from './dto/create-tablets-company.dto'
import { UpdateTabletsCompanyDto } from './dto/update-tablets-company.dto'

@Injectable()
export class TabletsCompaniesService {
	create(createTabletsCompanyDto: CreateTabletsCompanyDto) {
		return 'This action adds a new tabletsCompany'
	}

	findAll() {
		return `This action returns all tabletsCompanies`
	}

	findOne(id: number) {
		return `This action returns a #${id} tabletsCompany`
	}

	update(id: number, updateTabletsCompanyDto: UpdateTabletsCompanyDto) {
		return `This action updates a #${id} tabletsCompany`
	}

	remove(id: number) {
		return `This action removes a #${id} tabletsCompany`
	}
}

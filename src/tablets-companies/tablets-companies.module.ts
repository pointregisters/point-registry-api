import { Module } from '@nestjs/common'
import { TabletsCompaniesService } from './tablets-companies.service'
import { TabletsCompaniesController } from './tablets-companies.controller'

@Module({
	controllers: [TabletsCompaniesController],
	providers: [TabletsCompaniesService]
})
export class TabletsCompaniesModule {}

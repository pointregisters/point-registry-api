import { Module } from '@nestjs/common'
import { TabletsCompaniesService } from './tablets-companies.service'
import { TabletsCompaniesController } from './tablets-companies.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TabletsCompany } from './entities/tablets-company.entity'

@Module({
	imports: [TypeOrmModule.forFeature([TabletsCompany])],
	controllers: [TabletsCompaniesController],
	providers: [TabletsCompaniesService],
	exports: [TabletsCompaniesService]
})
export class TabletsCompaniesModule {}

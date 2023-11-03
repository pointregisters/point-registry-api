import { Module } from '@nestjs/common'
import { TabletsCompaniesService } from './tablets-companies.service'
import { TabletsCompaniesController } from './tablets-companies.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TabletsCompany } from './entities/tablets-company.entity'
import { Movement } from 'src/movements/entities/movement.entity'
import { Region } from 'src/region/entities/region.entity'

@Module({
	imports: [TypeOrmModule.forFeature([TabletsCompany, Movement, Region])],
	controllers: [TabletsCompaniesController],
	providers: [TabletsCompaniesService],
	exports: [TabletsCompaniesService]
})
export class TabletsCompaniesModule {}

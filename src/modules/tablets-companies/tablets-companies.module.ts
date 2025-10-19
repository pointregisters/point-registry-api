import { forwardRef, Module } from '@nestjs/common'
import { TabletsCompaniesService } from './tablets-companies.service'
import { TabletsCompaniesController } from './tablets-companies.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TabletsCompany } from './entities/tablets-company.entity'
import { Movement } from 'src/modules/movements/entities/movement.entity'
import { Region } from 'src/modules/region/entities/region.entity'
import { AuthModule } from 'src/auth/auth.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([TabletsCompany, Movement, Region]),
		forwardRef(() => AuthModule)
	],
	controllers: [TabletsCompaniesController],
	providers: [TabletsCompaniesService],
	exports: [TabletsCompaniesService]
})
export class TabletsCompaniesModule {}

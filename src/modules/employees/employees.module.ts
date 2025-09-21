import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Region } from 'src/modules/region/entities/region.entity'

import { EmployeesController } from './employees.controller'
import { EmployeesService } from './employees.service'
import { Employee } from './entities/employee.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Employee, Region])],
	controllers: [EmployeesController],
	providers: [EmployeesService],
	exports: [EmployeesService]
})
export class EmployeesModule {}

import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Region } from 'src/modules/region/entities/region.entity'

import { EmployeesController } from './employees.controller'
import { EmployeesService } from './employees.service'
import { Employee } from './entities/employee.entity'
import { AuthModule } from 'src/auth/auth.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([Employee, Region]),
		forwardRef(() => AuthModule)
	],
	controllers: [EmployeesController],
	providers: [EmployeesService],
	exports: [EmployeesService]
})
export class EmployeesModule {}

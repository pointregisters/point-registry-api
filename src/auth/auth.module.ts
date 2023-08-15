import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TabletsCompaniesModule } from 'src/tablets-companies/tablets-companies.module'
import { EmployeesModule } from 'src/employees/employees.module'

@Module({
	imports: [TabletsCompaniesModule, EmployeesModule],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}

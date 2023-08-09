import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EmployeesModule } from './employees/employees.module'
import { CompaniesModule } from './companies/companies.module'

@Module({
	imports: [EmployeesModule, CompaniesModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}

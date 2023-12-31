import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EmployeesModule } from './employees/employees.module'
import { CompaniesModule } from './companies/companies.module'
import { TabletsCompaniesModule } from './tablets-companies/tablets-companies.module'
import { MovementsModule } from './movements/movements.module'
import { DatabaseModule } from './database/database.module'
import { ConfigModule } from '@nestjs/config'
import { AwsS3Module } from './aws-s3/aws-s3.module'
import { RegionModule } from './region/region.module'
import { DepartmentModule } from './department/department.module'
import { RegisterQrcodeModule } from './register_qrcode/register_qrcode.module'
import { CommunicationsModule } from './communications/communications.module'
import { CommunicationsNotificationsModule } from './communications_notifications/communications_notifications.module'
import * as Joi from '@hapi/joi'

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				PORT: Joi.number(),
				DB_HOST: Joi.string().required(),
				DB_PORT: Joi.number().required(),
				DB_USER: Joi.string().required(),
				DB_PASSWORD: Joi.string().required(),
				DB_DATABASE: Joi.string().required()
			})
		}),
		EmployeesModule,
		CompaniesModule,
		TabletsCompaniesModule,
		MovementsModule,
		DatabaseModule,
		AwsS3Module,
		RegionModule,
		DepartmentModule,
		RegisterQrcodeModule,
		CommunicationsModule,
		CommunicationsNotificationsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}

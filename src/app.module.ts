import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EmployeesModule } from './modules/employees/employees.module'
import { CompaniesModule } from './modules/companies/companies.module'
import { TabletsCompaniesModule } from './modules/tablets-companies/tablets-companies.module'
import { MovementsModule } from './modules/movements/movements.module'
import { DatabaseModule } from './database/database.module'
import { ConfigModule } from '@nestjs/config'
import { AwsS3Module } from './aws-s3/aws-s3.module'
import { RegionModule } from './modules/region/region.module'
import { DepartmentModule } from './modules/department/department.module'
import { RegisterQrcodeModule } from './modules/register_qrcode/register_qrcode.module'
import { CommunicationsModule } from './modules/communications/communications.module'
import { CommunicationsNotificationsModule } from './modules/communications_notifications/communications_notifications.module'
import * as Joi from '@hapi/joi'
import { readFileSync } from 'fs'
import { join } from 'path'

const packageJson = JSON.parse(
	readFileSync(join(__dirname, '..', 'package.json'), 'utf8')
)

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [
				() => ({
					version: packageJson.version,
					appName: packageJson.name
				})
			],
			validationSchema: Joi.object({
				PORT: Joi.number(),
				DB_HOST: Joi.string().required(),
				DB_PORT: Joi.number().required(),
				DB_USER: Joi.string().required(),
				DB_PASSWORD: Joi.string().required(),
				DB_DATABASE: Joi.string().required(),
				JWT_SECRET: Joi.string().default(
					'seu_jwt_secret_super_seguro_aqui_mude_em_producao'
				)
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

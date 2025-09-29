import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DatabaseLoggerService } from '../modules/common/logger/database-logger.service'
import { CustomLogger } from '../modules/common/logger/custom-logger.service'
import { Employee } from 'src/modules/employees/entities/employee.entity'
import { Movement } from 'src/modules/movements/entities/movement.entity'
import { TabletsCompany } from 'src/modules/tablets-companies/entities/tablets-company.entity'
import { Company } from 'src/modules/companies/entities/company.entity'
import { Region } from 'src/modules/region/entities/region.entity'
import { RegisterQrcode } from 'src/modules/register_qrcode/entities/register_qrcode.entity'
import { CommunicationNotification } from 'src/modules/communications_notifications/entities/communications_notification.entity'
import { Communication } from 'src/modules/communications/entities/communications.entity'

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService, CustomLogger],
			useFactory: (configService: ConfigService, logger: CustomLogger) => ({
				type: 'mysql',
				host: configService.get('DB_HOST'),
				port: configService.get('DB_PORT'),
				username: configService.get('DB_USER'),
				password: configService.get('DB_PASSWORD'),
				database: configService.get('DB_DATABASE'),
				entities: [
					Employee,
					Movement,
					TabletsCompany,
					Company,
					Region,
					RegisterQrcode,
					CommunicationNotification,
					Communication
				],

				synchronize: false,
				logging: true,
				logger: new DatabaseLoggerService(logger),
				extra: {
					connectionLimit: 10,
					charset: 'utf8mb4'
				}
			})
		})
	]
})
export class DatabaseModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Employee } from 'src/employees/entities/employee.entity'
import { Movement } from 'src/movements/entities/movement.entity'
import { TabletsCompany } from 'src/tablets-companies/entities/tablets-company.entity'
import { Company } from 'src/companies/entities/company.entity'
import { Region } from 'src/region/entities/region.entity'

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'mysql',
				host: configService.get('DB_HOST'),
				port: configService.get('DB_PORT'),
				username: configService.get('DB_USER'),
				password: configService.get('DB_PASSWORD'),
				database: configService.get('DB_DATABASE'),
				synchronize: false,
				logging: true,
				entities: [Employee, Movement, TabletsCompany, Company, Region]
			})
		})
	]
})
export class DatabaseModule {}

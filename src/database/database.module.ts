import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Employee } from 'src/employees/entities/employee.entity'
import { Movement } from 'src/movements/entities/movement.entity'
import { TabletsCompany } from 'src/tablets-companies/entities/tablets-company.entity'
import { Company } from 'src/companies/entities/company.entity'

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('POSTGRES_HOST'),
				port: configService.get('POSTGRES_PORT'),
				username: configService.get('POSTGRES_USER'),
				password: configService.get('POSTGRES_PASSWORD'),
				database: configService.get('POSTGRES_DB'),
				synchronize: true,
				logging: true,
				entities: [Employee, Movement, TabletsCompany, Company]
			})
		})
	]
})
export class DatabaseModule {}

import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TabletsCompaniesModule } from 'src/tablets-companies/tablets-companies.module'

@Module({
	imports: [TabletsCompaniesModule],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}

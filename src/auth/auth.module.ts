import {
	forwardRef,
	MiddlewareConsumer,
	Module,
	NestModule
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LoginValidationMiddleware } from './middlewares/login-validation.middleware'
import { PassportModule } from '@nestjs/passport'
import { EmployeesModule } from 'src/modules/employees/employees.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		forwardRef(() => EmployeesModule),
		PassportModule,
		JwtModule.register({
			privateKey: process.env.JWT_SECRET_KEY,
			signOptions: { expiresIn: '1d' }
		})
	],
	providers: [AuthService, JwtStrategy],
	exports: [AuthService]
})
export class AuthModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoginValidationMiddleware).forRoutes('login')
	}
}

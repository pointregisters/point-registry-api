import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserToken } from './models/UserToken'
import { UserPayload } from './models/UserPayload'
import { EmployeesService } from 'src/modules/employees/employees.service'
import { Employee } from 'src/modules/employees/entities/employee.entity'

@Injectable()
export class AuthService {
	constructor(
		private readonly personService: EmployeesService,
		private readonly jwtService: JwtService
	) {}

	async login(user: Employee): Promise<UserToken> {
		const payload: UserPayload = {
			sub: user.id,
			email: user.email,
			registration: user.registration
		}

		return {
			access_token: this.jwtService.sign(payload),
			sub: user.id,
			email: user.email,
			userType: user.registration
		}
	}
}

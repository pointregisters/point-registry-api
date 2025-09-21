import { Controller, Get } from '@nestjs/common'

import { AppService } from './app.service'
import { CurrentUser } from './auth/decorators/current-user.decorator'
import { Employee } from './modules/employees/entities/employee.entity'
import { IsPublic } from './auth/decorators/is-public.decorator'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@IsPublic()
	@Get()
	getStatus(): string {
		return this.appService.getStatus()
	}

	@IsPublic()
	@Get('/me')
	getMe(@CurrentUser() currentUser: Employee) {
		return currentUser
	}
}

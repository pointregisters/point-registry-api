import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthRequest } from '../models/AuthRequest'
import { Employee } from 'src/modules/employees/entities/employee.entity'

export const CurrentUser = createParamDecorator(
	(data: unknown, context: ExecutionContext): Employee => {
		const request = context.switchToHttp().getRequest<AuthRequest>()

		return request.user
	}
)

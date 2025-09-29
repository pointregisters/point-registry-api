import { Request } from 'express'
import { Employee } from 'src/modules/employees/entities/employee.entity'

export interface AuthRequest extends Request {
	user: Employee
}

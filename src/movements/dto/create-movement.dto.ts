import { IsNotEmpty } from 'class-validator'

export class CreateMovementDto {
	@IsNotEmpty()
	uuuid: number

	@IsNotEmpty()
	employeePis: string

	@IsNotEmpty()
	date: string

	@IsNotEmpty()
	register: string

	@IsNotEmpty()
	companyId: string

	@IsNotEmpty()
	latitude: string

	@IsNotEmpty()
	longitude: string

	@IsNotEmpty()
	type: number

	@IsNotEmpty()
	companyRegister: string

	@IsNotEmpty()
	nsr: string
}

import { IsNotEmpty } from 'class-validator'

export class CreateEmployeeDto {
	@IsNotEmpty()
	id: number
	@IsNotEmpty()
	image: string
	@IsNotEmpty()
	pis: string
	@IsNotEmpty()
	name: string
	@IsNotEmpty()
	registration: string
	@IsNotEmpty()
	companyId: number
	@IsNotEmpty()
	contract: number
	@IsNotEmpty()
	phoneUuid: number
	@IsNotEmpty()
	phoneStatus: number
	@IsNotEmpty()
	matriz: number
	@IsNotEmpty()
	token: string
}

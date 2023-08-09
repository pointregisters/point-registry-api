import { IsNotEmpty } from 'class-validator'

export class CreateTabletsCompanyDto {
	@IsNotEmpty()
	id: number

	@IsNotEmpty()
	companyId: string

	@IsNotEmpty()
	matriz: number

	@IsNotEmpty()
	terminal: string

	@IsNotEmpty()
	uuid: string

	@IsNotEmpty()
	status: number

	@IsNotEmpty()
	dataInstalacao: string

	@IsNotEmpty()
	token: string
}

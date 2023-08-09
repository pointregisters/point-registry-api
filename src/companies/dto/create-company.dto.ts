import { IsNotEmpty } from 'class-validator'

export class CreateCompanyDto {
	@IsNotEmpty()
	id: number

	@IsNotEmpty()
	razaoSocial: string

	@IsNotEmpty()
	cnpj: string

	@IsNotEmpty()
	type: number

	@IsNotEmpty()
	matrizId: number

	@IsNotEmpty()
	matriz: number

	@IsNotEmpty()
	token: string
}

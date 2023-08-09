import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCompanyDto {
	@ApiProperty()
	@IsNotEmpty()
	id: number

	@ApiProperty()
	@IsNotEmpty()
	razaoSocial: string

	@ApiProperty()
	@IsNotEmpty()
	cnpj: string

	@ApiProperty()
	@IsNotEmpty()
	type: number

	@ApiProperty()
	@IsNotEmpty()
	matrizId: number

	@ApiProperty()
	@IsNotEmpty()
	matriz: number

	@ApiProperty()
	@IsNotEmpty()
	token: string
}

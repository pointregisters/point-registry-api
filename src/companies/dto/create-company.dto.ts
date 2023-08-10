import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export enum Type {
	MATRIZ = 'matriz',
	FILIAL = 'filial'
}
export class CreateCompanyDto {
	@ApiProperty()
	@IsNotEmpty()
	razaoSocial: string

	@ApiProperty()
	@IsNotEmpty()
	cnpj: string

	@ApiProperty()
	@IsNotEmpty()
	type: Type

	@ApiProperty()
	@IsNotEmpty()
	matrizId: number

	@ApiProperty()
	@IsNotEmpty()
	matriz: number
}

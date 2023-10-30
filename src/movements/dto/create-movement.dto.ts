import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { Company } from 'src/companies/entities/company.entity'

export enum MovementType {
	'BIOMETRIA' = 'biometria',
	'MATRICULA' = 'matricula',
	'FOTO CELULAR' = 'foto celular',
	'QRCODE' = 'qrcode',
	'Relogio' = 'relogio'
}
export class CreateMovementDto {
	@ApiProperty()
	@IsOptional()
	uuid: string

	@ApiProperty()
	@IsOptional()
	employeePis: string

	@ApiProperty()
	@IsOptional()
	date: string

	@ApiProperty()
	@IsOptional()
	register: string

	@ApiProperty()
	@IsOptional()
	image: string

	@ApiProperty()
	@IsNotEmpty()
	company: Company

	@ApiProperty()
	@IsOptional()
	latitude: string

	@ApiProperty()
	@IsOptional()
	longitude: string

	@ApiProperty()
	@IsNotEmpty()
	type: number

	@ApiProperty()
	@IsNotEmpty()
	formRegister: number

	@ApiProperty()
	@IsOptional()
	companieRegister: number

	@ApiProperty()
	@IsOptional()
	nsr: string

	@ApiProperty()
	@IsNotEmpty()
	region: string
}

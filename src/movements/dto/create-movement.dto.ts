import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { Company } from 'src/companies/entities/company.entity'
import { Employee } from 'src/employees/entities/employee.entity'

export enum MovementType {
	'BIOMETRIA' = 'biometria',
	'MATRICULA' = 'matricula',
	'FOTO CELULAR' = 'foto celular',
	'QRCODE' = 'qrcode',
	'Relogio' = 'relogio'
}
export class CreateMovementDto {
	@ApiProperty()
	@IsNotEmpty()
	employeePis: string

	@ApiProperty()
	@IsNotEmpty()
	date: Date

	register: Date

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
	companieRegister: number

	@ApiProperty()
	@IsOptional()
	nsr: string

	@ApiProperty()
	@IsOptional()
	relogioId: number
}

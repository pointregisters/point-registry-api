import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateMovementDto {
	@ApiProperty()
	@IsNotEmpty()
	uuuid: number

	@ApiProperty()
	@IsNotEmpty()
	employeePis: string

	@ApiProperty()
	@IsNotEmpty()
	date: string

	@ApiProperty()
	@IsNotEmpty()
	register: string

	@ApiProperty()
	@IsNotEmpty()
	companyId: string

	@ApiProperty()
	@IsNotEmpty()
	latitude: string

	@ApiProperty()
	@IsNotEmpty()
	longitude: string

	@ApiProperty()
	@IsNotEmpty()
	type: number

	@ApiProperty()
	@IsNotEmpty()
	companyRegister: string

	@ApiProperty()
	@IsNotEmpty()
	nsr: string
}

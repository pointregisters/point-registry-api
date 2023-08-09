import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class CreateEmployeeDto {
	@ApiProperty()
	@IsNotEmpty()
	id: number

	@ApiProperty()
	@IsNotEmpty()
	image: string

	@ApiProperty()
	@IsNotEmpty()
	pis: string

	@ApiProperty()
	@IsNotEmpty()
	name: string

	@ApiProperty()
	@IsNotEmpty()
	registration: string

	@ApiProperty()
	@IsNotEmpty()
	companyId: number

	@ApiProperty()
	@IsNotEmpty()
	contract: number

	@ApiProperty()
	@IsNotEmpty()
	phoneUuid: number

	@ApiProperty()
	@IsNotEmpty()
	phoneStatus: number

	@ApiProperty()
	@IsNotEmpty()
	matriz: number

	@ApiProperty()
	@IsNotEmpty()
	token: string
}

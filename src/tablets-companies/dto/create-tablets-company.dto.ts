import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateTabletsCompanyDto {
	@ApiProperty()
	@IsNotEmpty()
	id: number

	@ApiProperty()
	@IsNotEmpty()
	companyId: string

	@ApiProperty()
	@IsNotEmpty()
	matriz: number

	@ApiProperty()
	@IsNotEmpty()
	terminal: string

	@ApiProperty()
	@IsNotEmpty()
	uuid: string

	@ApiProperty()
	@IsNotEmpty()
	status: number

	@ApiProperty()
	@IsNotEmpty()
	dataInstalacao: string

	@ApiProperty()
	@IsNotEmpty()
	token: string
}

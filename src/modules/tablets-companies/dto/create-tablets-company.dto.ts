import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateTabletsCompanyDto {
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
	@IsOptional()
	status: boolean

	@ApiProperty()
	@IsOptional()
	uuid: string

	@ApiProperty()
	@IsOptional()
	dataInstalacao: string
}

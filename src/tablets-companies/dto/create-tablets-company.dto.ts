import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { Company } from 'src/companies/entities/company.entity'

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
	dataInstalacao: string
}

import { IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Company } from 'src/companies/entities/company.entity'
export class CreateEmployeeDto {
	@ApiProperty()
	@IsOptional()
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
	company: Company

	@ApiProperty()
	@IsNotEmpty()
	contract: number

	@ApiProperty()
	@IsOptional()
	phoneUuid: number

	@ApiProperty()
	@IsOptional()
	phoneStatus: number

	@ApiProperty()
	@IsNotEmpty()
	matriz: number
}

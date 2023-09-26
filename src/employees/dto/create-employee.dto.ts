import { IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Company } from 'src/companies/entities/company.entity'
import { Department } from 'src/department/entities/department.entity'
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
	phoneUuid: string

	@ApiProperty()
	@IsOptional()
	phoneStatus: number

	@ApiProperty()
	@IsNotEmpty()
	matriz: number

	@ApiProperty()
	@IsOptional()
	finger1: Buffer

	@ApiProperty()
	@IsOptional()
	finger2: Buffer

	@ApiProperty()
	@IsOptional()
	register: Date

	@ApiProperty()
	@IsOptional()
	status: number

	@ApiProperty()
	@IsOptional()
	ferias: number

	@ApiProperty()
	@IsOptional()
	statusUpdate: number

	@ApiProperty()
	@IsOptional()
	department: Department

	@ApiProperty()
	@IsOptional()
	phoneMarcacao: number
}

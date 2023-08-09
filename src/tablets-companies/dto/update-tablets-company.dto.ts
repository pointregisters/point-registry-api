import { PartialType } from '@nestjs/mapped-types'
import { CreateTabletsCompanyDto } from './create-tablets-company.dto'

export class UpdateTabletsCompanyDto extends PartialType(
	CreateTabletsCompanyDto
) {}

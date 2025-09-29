import { IsOptional, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Company } from 'src/modules/companies/entities/company.entity'
import { Department } from 'src/modules/department/entities/department.entity'

export class CreateEmployeeDto {
	@ApiProperty()
	@IsOptional()
	id: number

	@ApiProperty()
	@IsNotEmpty()
	name: string

	@ApiProperty()
	@IsOptional()
	finger1: Buffer

	@ApiProperty()
	@IsOptional()
	finger2: Buffer

	@ApiProperty()
	@IsOptional()
	image: string

	@ApiProperty()
	@IsOptional()
	pis: string

	@ApiProperty()
	@IsOptional()
	registration: string

	@ApiProperty()
	@IsOptional()
	contract: number

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
	phoneUuid: string

	@ApiProperty()
	@IsOptional()
	phoneStatus: number

	@ApiProperty()
	@IsOptional()
	phoneMarcacao: number

	@ApiProperty()
	@IsOptional()
	matriz: number

	@ApiProperty()
	@IsOptional()
	dateAdmissao: Date

	@ApiProperty()
	@IsOptional()
	dateDemissao: Date

	@ApiProperty()
	@IsOptional()
	pontoBiometria: number

	@ApiProperty()
	@IsOptional()
	pontoMatricula: number

	@ApiProperty()
	@IsOptional()
	pontoCelular: number

	@ApiProperty()
	@IsOptional()
	pontoQrcode: number

	@ApiProperty()
	@IsOptional()
	telefone: string

	@ApiProperty()
	@IsOptional()
	nCarteiraTrabalho: string

	@ApiProperty()
	@IsOptional()
	cpf: string

	@ApiProperty()
	@IsOptional()
	token: string

	@ApiProperty()
	@IsOptional()
	cargaHoraria: string

	@ApiProperty()
	@IsOptional()
	supervisor: number

	@ApiProperty()
	@IsOptional()
	valorMonetarioDia: number

	@ApiProperty()
	@IsOptional()
	matriculaSes: string

	@ApiProperty()
	@IsOptional()
	orgaoServidor: number

	@ApiProperty()
	@IsOptional()
	cargo: number

	@ApiProperty()
	@IsOptional()
	dataNascimento: Date

	@ApiProperty()
	@IsOptional()
	rg: string

	@ApiProperty()
	@IsOptional()
	sexo: string

	@ApiProperty()
	@IsOptional()
	vinculo: string

	@ApiProperty()
	@IsOptional()
	cep: string

	@ApiProperty()
	@IsOptional()
	endereco: string

	@ApiProperty()
	@IsOptional()
	nCasa: string

	@ApiProperty()
	@IsOptional()
	bairro: string

	@ApiProperty()
	@IsOptional()
	complemento: string

	@ApiProperty()
	@IsOptional()
	cidade: string

	@ApiProperty()
	@IsOptional()
	estado: string

	@ApiProperty()
	@IsOptional()
	numeroConselho: string

	@ApiProperty()
	@IsOptional()
	email: string

	@ApiProperty()
	@IsOptional()
	turno: string

	@ApiProperty()
	@IsOptional()
	observacaoServidor: string

	@ApiProperty()
	@IsOptional()
	crm: string

	@ApiProperty()
	@IsOptional()
	loggedInAt: string

	@ApiProperty()
	@IsOptional()
	apiToken: string

	@ApiProperty()
	@IsNotEmpty()
	company: Company

	@ApiProperty()
	@IsOptional()
	department: Department
}

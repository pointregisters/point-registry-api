import { IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export enum Type {
	MATRIZ = 'matriz',
	FILIAL = 'filial'
}
export class CreateCompanyDto {
	@IsNotEmpty()
	@ApiProperty()
	id: number

	@IsNotEmpty()
	@ApiProperty()
	name: string

	@ApiProperty({ name: 'nome_fantasia', type: 'text', nullable: true })
	nomeFantasia: string

	@IsNotEmpty()
	@ApiProperty()
	cnpj: string

	@IsNotEmpty()
	@ApiProperty()
	type: number

	@IsOptional()
	@ApiProperty({ name: 'id_matriz' })
	idMatriz: number

	@IsNotEmpty()
	@ApiProperty()
	matriz: number

	@IsOptional()
	@ApiProperty()
	status: number

	@ApiProperty()
	local: string

	@IsNotEmpty()
	@ApiProperty({ name: 'date_contrato' })
	dateContrato: Date

	@IsOptional()
	@ApiProperty({ name: 'date_cancelamento' })
	dateCancelamento: Date

	@IsOptional()
	@ApiProperty({ name: 'data_contrato' })
	dataContrato: Date

	@IsNotEmpty()
	@ApiProperty()
	phone: string

	@IsNotEmpty()
	@ApiProperty()
	email: string

	@IsNotEmpty()
	@ApiProperty()
	login: string

	@IsNotEmpty()
	@ApiProperty()
	senha: string

	@IsNotEmpty()
	@ApiProperty({ name: 'status_implantacao' })
	statusImplantacao: number

	@IsOptional()
	@ApiProperty({ name: 'data_expiracao' })
	dataExpiracao: Date

	@IsOptional()
	@ApiProperty({ name: 'status_update' })
	statusUpdate: number

	@IsNotEmpty()
	@ApiProperty({ name: 'modalidade' })
	modalidade: number

	@IsNotEmpty()
	@ApiProperty({ name: 'modalidade_pagamento' })
	modalidadePagamento: number

	@IsNotEmpty()
	@ApiProperty({ name: 'plano_aderido' })
	planoAderido: number

	@IsNotEmpty()
	@ApiProperty()
	protocolo: string

	@IsNotEmpty()
	@ApiProperty()
	producao: number

	@IsNotEmpty()
	@ApiProperty({ name: 'data_vencimento' })
	dataVencimento: string

	@IsOptional()
	@ApiProperty()
	desconto: string

	@IsOptional()
	@ApiProperty({ name: 'qtde_colaboradores' })
	qtdeColaboradores: number

	@IsOptional()
	@ApiProperty({ name: 'boas_vinda' })
	boasVinda: number

	@IsOptional()
	@ApiProperty({ name: 'qtde_batidas' })
	qtdeBatidas: number

	@IsOptional()
	@ApiProperty({ name: 'boas_vinda_trabalho_noturno' })
	boasVindaTrabalhoNoturno: number

	@IsOptional()
	@ApiProperty({ name: 'trabalho_noturno' })
	trabalhoNoturno: number

	@IsOptional()
	@ApiProperty({ name: 'region_id' })
	regionId: number

	@IsOptional()
	@ApiProperty({ name: 'corporativo' })
	corporativo: number

	@IsOptional()
	@ApiProperty({ name: 'date_migracao_corporativo' })
	dateMigracaoCorporativo: Date

	@IsOptional()
	@ApiProperty({ name: 'mensalidade' })
	mensalidade: number

	@IsOptional()
	@ApiProperty({ name: 'qrcode_apres_nome_empresa' })
	qrcodeApresNomeEmpresa: number

	@IsOptional()
	@ApiProperty({ name: 'ponto_gerente_ajuste' })
	pontoGerenteAjuste: number

	@IsOptional()
	@ApiProperty({ name: 'supervisao' })
	supervisao: number

	@IsOptional()
	@ApiProperty({ name: 'register_matrizes_filiais' })
	registerMatrizesFiliais: number

	@IsOptional()
	@ApiProperty({ name: 'local_empresa' })
	localEmpresa: string

	@IsOptional()
	@ApiProperty()
	latitude: string

	@IsOptional()
	@ApiProperty()
	longitude: string

	@IsOptional()
	@ApiProperty({ name: 'km_raio' })
	kmRaio: number

	@IsOptional()
	@ApiProperty({ name: 'calcular_valores' })
	calcularValores: number

	@IsOptional()
	@ApiProperty({ name: 'rede_hospitalar' })
	redeHospitalar: number

	@IsOptional()
	@ApiProperty({ name: 'config_impressao' })
	configImpressao: number

	@IsOptional()
	@ApiProperty({ name: 'valor_unitario' })
	valorUnitario: number
}

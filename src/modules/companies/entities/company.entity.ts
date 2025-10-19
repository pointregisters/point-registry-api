import { Employee } from 'src/modules/employees/entities/employee.entity'
import { Movement } from 'src/modules/movements/entities/movement.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

export enum Type {
	MATRIZ = 'matriz',
	FILIAL = 'filial'
}

@Entity('companies')
export class Company {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ length: 191, nullable: false })
	name: string

	@Column({ name: 'nome_fantasia', type: 'text', nullable: true })
	nomeFantasia: string

	@Column({ length: 191, nullable: true })
	cnpj: string

	@Column({ nullable: true })
	type: number

	@Column({ nullable: true, name: 'id_matriz' })
	idMatriz: number

	@Column({ nullable: true })
	matriz: number

	@Column({ nullable: true })
	status: number

	@Column({ length: 100, nullable: true })
	local: string

	@Column({ nullable: true, name: 'date_contrato' })
	dateContrato: Date

	@Column({ nullable: true, name: 'date_cancelamento' })
	dateCancelamento: Date

	@Column({ nullable: true, name: 'data_contrato' })
	dataContrato: Date

	@Column({ length: 45, nullable: true })
	phone: string

	@Column({ length: 200, nullable: true })
	email: string

	@Column({ length: 100, nullable: true })
	login: string

	@Column({ length: 100, nullable: true })
	senha: string

	@Column({ nullable: true, name: 'status_implantacao' })
	statusImplantacao: number

	@Column({ nullable: true, name: 'data_expiracao' })
	dataExpiracao: Date

	@Column({ default: 0, name: 'status_update' })
	statusUpdate: number

	@Column({ default: 1, name: 'modalidade' })
	modalidade: number

	@Column({ default: 1, name: 'modalidade_pagamento' })
	modalidadePagamento: number

	@Column({ nullable: true, name: 'plano_aderido' })
	planoAderido: number

	@Column({ length: 150, nullable: true })
	protocolo: string

	@Column({ nullable: true })
	producao: number

	@Column({ length: 2, nullable: true, name: 'data_vencimento' })
	dataVencimento: string

	@Column({ length: 5, nullable: true })
	desconto: string

	@Column({ nullable: true, name: 'qtde_colaboradores' })
	qtdeColaboradores: number

	@Column({ default: 0, name: 'boas_vinda' })
	boasVinda: number

	@Column({ default: 1, name: 'qtde_batidas' })
	qtdeBatidas: number

	@Column({ default: 2, name: 'boas_vinda_trabalho_noturno' })
	boasVindaTrabalhoNoturno: number

	@Column({ default: 0, name: 'trabalho_noturno' })
	trabalhoNoturno: number

	@Column({ nullable: true, name: 'region_id' })
	regionId: number

	@Column({ default: 0, name: 'corporativo' })
	corporativo: number

	@Column({ nullable: true, name: 'date_migracao_corporativo' })
	dateMigracaoCorporativo: Date

	@Column({
		type: 'decimal',
		precision: 10,
		scale: 2,
		default: 0,
		name: 'mensalidade'
	})
	mensalidade: number

	@Column({ default: 0, name: 'qrcode_apres_nome_empresa' })
	qrcodeApresNomeEmpresa: number

	@Column({ default: 0, name: 'ponto_gerente_ajuste' })
	pontoGerenteAjuste: number

	@Column({ default: 0, name: 'supervisao' })
	supervisao: number

	@Column({ default: 0, name: 'register_matrizes_filiais' })
	registerMatrizesFiliais: number

	@Column({ length: 200, nullable: true, name: 'local_empresa' })
	localEmpresa: string

	@Column({ length: 180, nullable: true })
	latitude: string

	@Column({ length: 180, nullable: true })
	longitude: string

	@Column({ default: 1, name: 'km_raio' })
	kmRaio: number

	@Column({ default: 0, name: 'calcular_valores' })
	calcularValores: number

	@Column({ default: 0, name: 'rede_hospitalar' })
	redeHospitalar: number

	@Column({ default: 1, name: 'config_impressao' })
	configImpressao: number

	@Column({
		type: 'decimal',
		precision: 10,
		scale: 2,
		nullable: true,
		name: 'valor_unitario'
	})
	valorUnitario: number

	@OneToMany(() => Movement, (movement) => movement.company)
	movements: Movement[]

	@OneToMany(() => Employee, (employee) => employee.company)
	employee: Employee[]
}

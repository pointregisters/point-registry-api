import { ApiProperty } from '@nestjs/swagger'
import { Company } from 'src/companies/entities/company.entity'
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm'

import { v4 as uuidv4 } from 'uuid'

@Entity('employees')
export class Employee {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ length: 191, collation: 'utf8mb4_unicode_ci', nullable: false })
	name: string

	@Column({ type: 'blob', nullable: true })
	finger1: Buffer

	@Column({ type: 'blob', nullable: true })
	finger2: Buffer

	@Column({ length: 191, collation: 'utf8mb4_unicode_ci', nullable: true })
	image: string

	@Column({ length: 191, collation: 'utf8mb4_unicode_ci', nullable: false })
	pis: string

	@Column({ length: 191, collation: 'utf8mb4_unicode_ci', nullable: true })
	registration: string

	@ManyToOne(() => Company, (company) => company.employee)
	@JoinColumn({ name: 'companie_id' })
	company: Company

	@Column({ nullable: true })
	contract: number

	@Column({ type: 'datetime', nullable: true })
	register: Date

	@Column({ default: 1 })
	status: number

	@Column({ default: 0, name: 'ferias' })
	ferias: number

	@Column({ default: 0, name: 'status_update' })
	statusUpdate: number

	@Column({
		type: 'text',
		collation: 'utf8mb4_unicode_ci',
		nullable: true,
		name: 'phone_uuid'
	})
	phoneUuid: string

	@Column({ default: 0, name: 'phone_status' })
	phoneStatus: number

	@Column({ default: 1, name: 'phone_marcacao' })
	phoneMarcacao: number

	@Column({ type: 'bigint', unsigned: true, nullable: true, name: 'matriz' })
	matriz: number

	@Column({ type: 'date', nullable: true, name: 'date_admissao' })
	dateAdmissao: Date

	@Column({ type: 'date', nullable: true, name: 'date_demissao' })
	dateDemissao: Date

	@Column({ type: 'int', default: 1, name: 'ponto_biometria' })
	pontoBiometria: number

	@Column({ type: 'int', default: 1, name: 'ponto_matricula' })
	pontoMatricula: number

	@Column({ type: 'int', default: 0, name: 'ponto_celular' })
	pontoCelular: number

	@Column({ type: 'int', default: 0, name: 'ponto_qrcode' })
	pontoQrcode: number

	@Column({ type: 'varchar', length: 60, nullable: true })
	telefone: string

	@Column({
		type: 'varchar',
		length: 200,
		nullable: true,
		name: 'n_carteira_trabalho'
	})
	nCarteiraTrabalho: string

	@Column({ type: 'varchar', length: 45, nullable: true })
	cpf: string

	@Column({ type: 'text', nullable: true })
	token: string

	@Column({ type: 'time', default: '00:00:00', name: 'carga_horaria' })
	cargaHoraria: string

	@Column({ type: 'int', default: 0, name: 'supervisor' })
	supervisor: number

	@Column({
		type: 'decimal',
		precision: 10,
		scale: 2,
		nullable: true,
		name: 'valor_monetario_dia'
	})
	valorMonetarioDia: number

	@Column({
		type: 'varchar',
		length: 100,
		nullable: true,
		name: 'matricula_ses'
	})
	matriculaSes: string

	@Column({ type: 'bigint', nullable: true, name: 'orgao_servidor' })
	orgaoServidor: number

	@Column({ type: 'bigint', nullable: true, name: 'cargo' })
	cargo: number

	@Column({ type: 'date', nullable: true, name: 'data_nascimento' })
	dataNascimento: Date

	@Column({ type: 'varchar', length: 90, nullable: true })
	rg: string

	@Column({ type: 'varchar', length: 90, nullable: true })
	sexo: string

	@Column({ type: 'varchar', length: 200, nullable: true })
	vinculo: string

	@Column({ type: 'varchar', length: 100, nullable: true })
	cep: string

	@Column({ type: 'text', nullable: true })
	endereco: string

	@Column({ type: 'varchar', length: 80, nullable: true, name: 'n_casa' })
	nCasa: string

	@Column({ type: 'text', nullable: true })
	bairro: string

	@Column({ type: 'text', nullable: true })
	complemento: string

	@Column({ type: 'varchar', length: 150, nullable: true })
	cidade: string

	@Column({ type: 'varchar', length: 60, nullable: true })
	estado: string

	@Column({
		type: 'varchar',
		length: 180,
		nullable: true,
		name: 'numero_conselho'
	})
	numeroConselho: string

	@Column({ type: 'text', nullable: true })
	email: string

	@Column({ type: 'varchar', length: 180, nullable: true })
	turno: string

	@Column({ type: 'text', nullable: true, name: 'observacao_servidor' })
	observacaoServidor: string

	@Column({ type: 'varchar', length: 90, nullable: true, name: 'crm' })
	crm: string

	@Column({ type: 'timestamp', nullable: true, name: 'logged_in_at' })
	loggedInAt: Date

	@Column({ type: 'text', nullable: true, name: 'api_token' })
	apiToken: string
}

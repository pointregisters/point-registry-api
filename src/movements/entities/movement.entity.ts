import { ApiProperty } from '@nestjs/swagger'
import { Company } from 'src/companies/entities/company.entity'
import { Employee } from 'src/employees/entities/employee.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { v4 as uuidv4 } from 'uuid'

export enum MovementType {
	'BIOMETRIA' = 'biometria',
	'MATRICULA' = 'matricula',
	'FOTO CELULAR' = 'foto celular',
	'QRCODE' = 'qrcode',
	'Relogio' = 'relogio'
}

@Entity('movements')
export class Movement {
	@PrimaryColumn({ length: 150, collation: 'utf8mb4_unicode_ci' })
	uuid: string

	@Column({
		name: 'employee_pis',
		length: 20,
		collation: 'utf8mb4_unicode_ci',
		nullable: true
	})
	employeePis: string

	@Column({ type: 'date' })
	date: Date

	@Column({ type: 'datetime' })
	register: Date

	@Column({ length: 191, collation: 'utf8mb4_unicode_ci', nullable: true })
	image: string

	@ManyToOne(() => Company, (company) => company.movements)
	@JoinColumn({ name: 'companie_id' })
	company: Company

	@Column({ type: 'text', collation: 'utf8mb4_unicode_ci', nullable: true })
	latitude: string

	@Column({ type: 'text', collation: 'utf8mb4_unicode_ci', nullable: true })
	longitude: string

	@Column({ nullable: true })
	type: number

	@Column({ name: 'companie_register', nullable: true })
	companieRegister: number

	@Column({ length: 150, collation: 'utf8mb4_unicode_ci', nullable: true })
	nsr: string

	@Column({ nullable: true, name: 'relogio_id' })
	relogioId: number
}

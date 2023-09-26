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

@Entity()
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
}

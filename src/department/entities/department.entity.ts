import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

import { Company } from '../../companies/entities/company.entity'

@Entity('departments')
export class Department {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ length: 191, collation: 'utf8mb4_unicode_ci', nullable: false })
	name: string

	@Column({ name: 'companie_id' })
	company: Company

	@Column({ default: 0 })
	matriz: number
}

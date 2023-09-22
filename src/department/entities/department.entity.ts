// src/departments/entities/department.entity.ts

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	OneToMany
} from 'typeorm'

import { Company } from '../../companies/entities/company.entity' // Certifique-se de ajustar o caminho de importação conforme necessário
import { Employee } from 'src/employees/entities/employee.entity'

@Entity('departments')
export class Department {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ length: 191, collation: 'utf8mb4_unicode_ci', nullable: false })
	name: string

	// @ManyToOne(() => Company, (company) => company.departments)
	// @JoinColumn({ name: 'companie_id' })
	@Column({ name: 'companie_id' })
	company: Company

	@Column({ default: 0 })
	matriz: number
}

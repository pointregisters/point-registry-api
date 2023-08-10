import { ApiProperty } from '@nestjs/swagger'
import { Company } from 'src/companies/entities/company.entity'
import { Employee } from 'src/employees/entities/employee.entity'
import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

import { v4 as uuidv4 } from 'uuid'

@Entity()
export class Movement {
	@PrimaryGeneratedColumn('uuid')
	@ApiProperty()
	id: string

	@Column({ name: 'employee_pis' })
	@ApiProperty()
	employeePis: string

	@Column()
	@ApiProperty()
	date: string

	@Column()
	@ApiProperty()
	register: string

	// @Column({ name: 'company_id' })
	// @ApiProperty()
	// companyId: string

	@ManyToMany(() => Company, (company) => company.movements)
	// @JoinTable()
	companies: Company[]

	@ManyToMany(() => Employee, (employee) => employee.movements)
	// @JoinTable()
	employees: Employee[]

	@Column()
	@ApiProperty()
	latitude: string

	@Column()
	@ApiProperty()
	longitude: string

	@Column()
	@ApiProperty()
	type: number

	@Column({ name: 'company_register' })
	@ApiProperty()
	companyRegister: string

	@Column()
	@ApiProperty()
	nsr: string

	@CreateDateColumn({
		type: 'timestamp',
		name: 'create_at',
		default: () => 'CURRENT_TIMESTAMP(6)'
	})
	@ApiProperty()
	createAt: Date

	@UpdateDateColumn({
		type: 'timestamp',
		name: 'update_at',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)'
	})
	@ApiProperty()
	updateAt: Date

	@DeleteDateColumn({
		type: 'timestamp',
		name: 'deleted_at'
	})
	@ApiProperty()
	deletedAt: Date

	@BeforeInsert()
	generateUUID() {
		this.id = uuidv4()
	}
}

import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

import { v4 as uuidv4 } from 'uuid'

@Entity()
export class Movement {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ name: 'employee_pis' })
	employeePis: string

	@Column()
	date: string

	@Column()
	register: string

	@Column({ name: 'company_id' })
	companyId: string

	@Column()
	latitude: string

	@Column()
	longitude: string

	@Column()
	type: number

	@Column({ name: 'company_register' })
	companyRegister: string

	@Column()
	nsr: string

	@CreateDateColumn({
		type: 'timestamp',
		name: 'create_at',
		default: () => 'CURRENT_TIMESTAMP(6)'
	})
	createAt: Date

	@UpdateDateColumn({
		type: 'timestamp',
		name: 'update_at',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)'
	})
	updateAt: Date

	@DeleteDateColumn({
		type: 'timestamp',
		name: 'deleted_at'
	})
	deletedAt: Date

	@BeforeInsert()
	generateUUID() {
		this.id = uuidv4()
	}
}

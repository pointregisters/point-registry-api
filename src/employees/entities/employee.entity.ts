import { ApiProperty } from '@nestjs/swagger'
import { Company } from 'src/companies/entities/company.entity'
import { Movement } from 'src/movements/entities/movement.entity'
import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

import { v4 as uuidv4 } from 'uuid'

@Entity()
export class Employee {
	@PrimaryGeneratedColumn()
	@ApiProperty()
	id: number

	@Column({ default: null })
	@ApiProperty()
	image: string

	@Column()
	@ApiProperty()
	pis: string

	@Column()
	@ApiProperty()
	name: string

	@Column()
	@ApiProperty()
	registration: string

	@ManyToOne(() => Company, (company) => company.employee)
	@ApiProperty()
	company: Company

	@ManyToMany(() => Movement, (movement) => movement.employees)
	movements: Movement[]

	@Column()
	@ApiProperty()
	contract: number

	@Column({ name: 'phone_uuid', default: null })
	@ApiProperty()
	phoneUuid: number

	@Column({ name: 'phone_status', default: null })
	@ApiProperty()
	phoneStatus: number

	@Column()
	@ApiProperty()
	matriz: number

	@Column()
	@ApiProperty()
	token: string

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
	generateToken() {
		this.token = uuidv4()
	}
}

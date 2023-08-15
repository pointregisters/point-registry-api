import { ApiProperty } from '@nestjs/swagger'
import { Company } from 'src/companies/entities/company.entity'
import { Employee } from 'src/employees/entities/employee.entity'
import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

import { v4 as uuidv4 } from 'uuid'

export enum MovementType {
	'BIOMETRIA' = 'biometria',
	'MATRICULA' = 'matricula',
	'FOTO CELULAR' = 'foto celular',
	'QRCODE' = 'qrcode',
	'Relogio' = 'relogio'
}

@Entity()
export class Movement {
	@PrimaryGeneratedColumn('uuid')
	@ApiProperty()
	id: string

	@Column({
		type: 'timestamp',
		name: 'date',
		default: () => 'CURRENT_TIMESTAMP(6)'
	})
	@ApiProperty()
	date: Date

	@Column({ default: null })
	@ApiProperty()
	image: string

	@CreateDateColumn({
		type: 'timestamp',
		name: 'register',
		default: () => 'CURRENT_TIMESTAMP(6)'
	})
	@ApiProperty()
	register: string

	@ManyToOne(() => Company, (company) => company.movements)
	company: Company

	@ManyToOne(() => Employee, (employee) => employee.movements)
	employee: Employee

	@Column({ default: null })
	@ApiProperty()
	latitude: string

	@Column({ default: null })
	@ApiProperty()
	longitude: string

	@Column({
		type: 'varchar',
		default: MovementType.BIOMETRIA,
		name: 'MovementType'
	})
	@ApiProperty()
	type: MovementType

	@Column({ default: null })
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
	generateUUIDAndDate() {
		this.id = uuidv4()
		if (this.date instanceof Date) {
			this.date = new Date(this.date.toDateString())
		}
	}
}

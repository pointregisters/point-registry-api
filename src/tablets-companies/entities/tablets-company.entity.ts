import { ApiProperty } from '@nestjs/swagger'
import { Company } from 'src/companies/entities/company.entity'
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

@Entity('tablets_companies')
export class TabletsCompany {
	@PrimaryGeneratedColumn()
	@ApiProperty()
	id: number

	@Column()
	@ApiProperty()
	matriz: number

	@Column()
	@ApiProperty()
	terminal: string

	@Column()
	@ApiProperty()
	uuid: string

	@Column({ default: true })
	@ApiProperty()
	status: boolean

	@Column({ name: ' data_instalacao', default: null })
	@ApiProperty()
	dataInstalacao: Date

	@Column()
	@ApiProperty()
	token: string

	@ManyToOne(() => Company, (company) => company.tabletsCompany)
	@ApiProperty()
	company: Company

	@CreateDateColumn({
		type: 'timestamp',
		name: 'data_registro',
		default: () => 'CURRENT_TIMESTAMP(6)'
	})
	@ApiProperty()
	dataRegistro: Date

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
		this.uuid = uuidv4()
	}
}

import { ApiProperty } from '@nestjs/swagger'
import { Company } from 'src/companies/entities/company.entity'
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

@Entity('tablets_companies')
export class TabletsCompany {
	@PrimaryGeneratedColumn()
	@ApiProperty()
	id: number

	@Column({ name: 'razao_social' })
	@ApiProperty()
	companyId: string

	@Column()
	@ApiProperty()
	matriz: number

	@Column()
	@ApiProperty()
	terminal: string

	@Column()
	@ApiProperty()
	uuid: string

	@Column()
	@ApiProperty()
	status: number

	@Column({ name: 'data_registro' })
	@ApiProperty()
	dataInstalacao: string

	@Column()
	@ApiProperty()
	token: string

	@ManyToOne(() => Company, (company) => company.tabletsCompany)
	@ApiProperty()
	company: Company

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
}

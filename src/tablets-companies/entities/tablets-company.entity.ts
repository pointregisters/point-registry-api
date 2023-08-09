import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

@Entity()
export class TabletsCompany {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'razao_social' })
	companyId: string

	@Column()
	matriz: number

	@Column()
	terminal: string

	@Column()
	uuid: string

	@Column()
	status: number

	@Column({ name: 'data_registro' })
	dataInstalacao: string

	@Column()
	token: string

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
}

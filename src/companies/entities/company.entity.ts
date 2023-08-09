import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

@Entity()
export class Company {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'razao_social' })
	razaoSocial: string

	@Column()
	cnpj: string

	@Column()
	type: number

	@Column({ name: 'id_matriz' })
	matrizId: number

	@Column()
	matriz: number

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

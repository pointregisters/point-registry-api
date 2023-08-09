import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

@Entity()
export class Employee {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	image: string

	@Column()
	pis: string

	@Column()
	name: string

	@Column()
	registration: string

	@Column({ name: 'companie_id' })
	companyId: number

	@Column()
	contract: number

	@Column({ name: 'phone_uuid' })
	phoneUuid: number

	@Column({ name: 'phone_status' })
	phoneStatus: number

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

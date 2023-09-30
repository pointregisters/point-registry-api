import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('communications')
export class Communication {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'text' })
	token: string

	@Column({ type: 'bigint' })
	companie_id: number

	@Column({ type: 'bigint' })
	matriz: number

	@Column({ type: 'text' })
	titulo: string

	@Column({ type: 'text', nullable: true })
	description: string

	@Column({ type: 'date', nullable: true })
	date_register: Date

	@Column({ type: 'date', nullable: true })
	date_reuniao: Date

	@Column({ type: 'int', default: 1 })
	status: number

	@Column({ type: 'bigint', nullable: true, comment: 'opção gestor' })
	users_id: number
	notifications: any
}

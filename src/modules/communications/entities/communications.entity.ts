import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('communications')
export class Communication {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'text' })
	token: string

	@Column({ type: 'bigint', name: 'status_update' })
	companyId: number

	@Column({ type: 'bigint' })
	matriz: number

	@Column({ type: 'text', name: 'titulo' })
	title: string

	@Column({ type: 'text', nullable: true })
	description: string

	@Column({ type: 'date', nullable: true, name: 'date_register' })
	dateRegister: Date

	@Column({ type: 'date', nullable: true, name: 'date_reuniao' })
	dateReunion: Date

	@Column({ type: 'int', default: 1 })
	status: number

	@Column({
		type: 'bigint',
		nullable: true,
		comment: 'opção gestor',
		name: 'users_id'
	})
	usersId: number
	notifications: any
}

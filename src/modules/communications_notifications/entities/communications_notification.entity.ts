import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('communications_notifications')
export class CommunicationNotification {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'bigint', name: 'employee_id' })
	employeeId: number

	@Column({ type: 'bigint', name: 'comunication_id' })
	communicationId: number

	@Column({ type: 'bigint', name: 'companie_id' })
	companyId: number

	@Column({ type: 'bigint' })
	matriz: number

	@Column({ type: 'date', nullable: true, name: 'data_notificacao' })
	dataNotification: Date

	@Column({ type: 'date', nullable: true, name: 'data_confirmacao' })
	dataConfirmation: Date

	@Column({ type: 'int', nullable: true })
	status: number

	@Column({ type: 'int', default: 0, name: 'adm_visualizou' })
	admVisualized: number

	@Column({
		type: 'bigint',
		nullable: true,
		comment: 'opção gestor',
		name: 'users_id'
	})
	usersId: number
}

import { Communication } from 'src/communications/entities/communications.entity'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

@Entity('communications_notifications')
export class CommunicationNotification {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(
		() => Communication,
		(communication) => communication.notifications
	)
	comunication: Communication

	@Column({ type: 'bigint' })
	employee_id: number

	@Column({ type: 'bigint' })
	companie_id: number

	@Column({ type: 'bigint' })
	matriz: number

	@Column({ type: 'date', nullable: true })
	data_notificacao: Date

	@Column({ type: 'date', nullable: true })
	data_confirmacao: Date

	@Column({ type: 'int', nullable: true })
	status: number

	@Column({ type: 'int', default: 0 })
	adm_visualizou: number

	@Column({ type: 'bigint', nullable: true, comment: 'opção gestor' })
	users_id: number
}

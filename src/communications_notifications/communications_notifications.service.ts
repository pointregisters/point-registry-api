import { Injectable } from '@nestjs/common'
import { CreateCommunicationsNotificationDto } from './dto/create-communications_notification.dto'
import { UpdateCommunicationsNotificationDto } from './dto/update-communications_notification.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CommunicationNotification } from './entities/communications_notification.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CommunicationsNotificationsService {
	constructor(
		@InjectRepository(CommunicationNotification)
		private readonly communicationNotificationRepository: Repository<CommunicationNotification>
	) {}

	async getNotificationsQuantity(pis: string): Promise<number> {
		return this.communicationNotificationRepository
			.createQueryBuilder('cn')
			.leftJoin('employees', 'emp', 'emp.id = cn.employee_id')
			.where('emp.pis = :pis', { pis })
			.andWhere('cn.status = 0')
			.select('COUNT(DISTINCT cn.id)', 'quantity')
			.getRawOne()
			.then((result) => result.quantity)
	}

	async getReadNotifications(pis: string) {
		return this.communicationNotificationRepository
			.createQueryBuilder('cn')
			.innerJoin('cn.communication', 'c')
			.innerJoin('cn.employee', 'emp')
			.where('emp.pis = :pis', { pis })
			.andWhere('cn.status = 1')
			.orderBy('cn.data_confirmacao')
			.select([
				'cn.id as cn_id',
				'cn.status as cn_status',
				'DATE_FORMAT(cn.data_confirmacao, "%d/%m/%Y") as data_confirmacao',
				'c.*',
				'DATE_FORMAT(cn.data_notificacao, "%d/%m/%Y") as data_reuniao'
			])
			.getRawMany()
	}

	async getUnreadNotifications(pis: string) {
		return this.communicationNotificationRepository
			.createQueryBuilder('cn')
			.innerJoin('cn.communication', 'c')
			.innerJoin('cn.employee', 'emp')
			.where('emp.pis = :pis', { pis })
			.andWhere('cn.status = 0')
			.orderBy('cn.data_notificacao')
			.select([
				'cn.id as cn_id',
				'cn.status as cn_status',
				'DATE_FORMAT(cn.data_confirmacao, "%d/%m/%Y") as data_confirmacao',
				'c.*',
				'DATE_FORMAT(cn.data_notificacao, "%d/%m/%Y") as data_reuniao'
			])
			.getRawMany()
	}

	async updateNotification(id: number) {
		const notification = await this.communicationNotificationRepository.findOne(
			{
				where: {
					id
				}
			}
		)

		if (!notification) {
			return { status: 'error', message: 'Notificação não encontrada' }
		}

		notification.status = 1
		notification.data_confirmacao = new Date()

		await this.communicationNotificationRepository.save(notification)

		return {
			status: 'ok',
			data: new Date().toLocaleDateString('pt-BR', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			})
		}
	}
	create(
		createCommunicationsNotificationDto: CreateCommunicationsNotificationDto
	) {
		return 'This action adds a new communicationsNotification'
	}

	async findAll() {
		return await this.communicationNotificationRepository.find()
	}

	async findOne(id: number) {
		return await this.communicationNotificationRepository.findOne({
			where: {
				id
			}
		})
	}

	update(
		id: number,
		updateCommunicationsNotificationDto: UpdateCommunicationsNotificationDto
	) {
		return `This action updates a #${id} communicationsNotification`
	}

	remove(id: number) {
		return `This action removes a #${id} communicationsNotification`
	}
}

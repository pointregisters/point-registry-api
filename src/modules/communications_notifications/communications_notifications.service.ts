import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateCommunicationsNotificationDto } from './dto/create-communications_notification.dto'
import { UpdateCommunicationsNotificationDto } from './dto/update-communications_notification.dto'
import { CommunicationNotification } from './entities/communications_notification.entity'

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
		const comunication = await this.communicationNotificationRepository
			.createQueryBuilder('cn')
			.select([
				'cn.id as cn_id',
				'cn.status as cn_status',
				'DATE_FORMAT(cn.data_confirmacao, "%d/%m/%Y") as data_confirmacao',
				'DATE_FORMAT(cn.data_notificacao, "%d/%m/%Y") as data_reuniao',
				'c.id as c_id',
				'c.token as c_token',
				'c.companie_id as c_companie_id',
				'c.matriz as c_matriz',
				'c.titulo as c_titulo',
				'c.description as c_description',
				'c.date_register as c_date_register',
				'c.date_reuniao as c_date_reuniao',
				'c.status as c_status',
				'c.users_id as c_users_id'
			])
			.leftJoin('communications', 'c', 'c.id = cn.comunication_id')
			.leftJoin('employees', 'e', 'e.id = cn.employee_id')
			.where('e.pis = :pis', { pis })
			.andWhere('cn.status = 1')
			.orderBy('cn.data_confirmacao')
			.getRawMany()

		return comunication.map((item: any) => ({
			id: item.cn_id,
			status: item.cn_status,
			dataConfirmation: item.data_confirmacao,
			dataNotification: item.data_reuniao,
			communications: {
				id: item.c_id,
				token: item.c_token,
				companyId: item.c_companie_id,
				matriz: item.c_matriz,
				title: item.c_titulo,
				description: item.c_description,
				dateRegister: item.c_date_register,
				dateReunion: item.c_date_reuniao,
				status: item.c_status,
				usersId: item.c_users_id
			}
		}))
	}

	async getUnreadNotifications(pis: string) {
		const comunication = await this.communicationNotificationRepository
			.createQueryBuilder('cn')
			.select([
				'cn.id as cn_id',
				'cn.status as cn_status',
				'DATE_FORMAT(cn.data_confirmacao, "%d/%m/%Y") as data_confirmacao',
				'DATE_FORMAT(cn.data_notificacao, "%d/%m/%Y") as data_reuniao',
				'c.id as c_id',
				'c.token as c_token',
				'c.companie_id as c_companie_id',
				'c.matriz as c_matriz',
				'c.titulo as c_titulo',
				'c.description as c_description',
				'c.date_register as c_date_register',
				'c.date_reuniao as c_date_reuniao',
				'c.status as c_status',
				'c.users_id as c_users_id'
			])
			.leftJoin('communications', 'c', 'c.id = cn.comunication_id')
			.leftJoin('employees', 'e', 'e.id = cn.employee_id')
			.where('e.pis = :pis', { pis })
			.andWhere('cn.status = 0')
			.orderBy('cn.data_confirmacao')
			.getRawMany()

		return comunication.map((item: any) => ({
			id: item.cn_id,
			status: item.cn_status,
			dataConfirmation: item.data_confirmacao,
			dataNotification: item.data_reuniao,
			communications: {
				id: item.c_id,
				token: item.c_token,
				companyId: item.c_companie_id,
				matriz: item.c_matriz,
				title: item.c_titulo,
				description: item.c_description,
				dateRegister: item.c_date_register,
				dateReunion: item.c_date_reuniao,
				status: item.c_status,
				usersId: item.c_users_id
			}
		}))
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
		notification.dataConfirmation = new Date()

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

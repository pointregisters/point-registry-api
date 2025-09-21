import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put
} from '@nestjs/common'

import { CommunicationsNotificationsService } from './communications_notifications.service'
import { CreateCommunicationsNotificationDto } from './dto/create-communications_notification.dto'
import { UpdateCommunicationsNotificationDto } from './dto/update-communications_notification.dto'

@Controller('communications-notifications')
export class CommunicationsNotificationsController {
	constructor(
		private readonly communicationsNotificationsService: CommunicationsNotificationsService
	) {}

	@Get(':pis/quantity')
	async getNotificationsQuantity(@Param('pis') pis: string) {
		const quantity =
			await this.communicationsNotificationsService.getNotificationsQuantity(
				pis
			)
		return { data: quantity }
	}

	@Get('read/:pis')
	async getReadNotifications(@Param('pis') pis: string) {
		return this.communicationsNotificationsService.getReadNotifications(pis)
	}

	@Get('unread/:pis')
	async getUnreadNotifications(@Param('pis') pis: string) {
		return this.communicationsNotificationsService.getUnreadNotifications(pis)
	}

	@Put(':id/update')
	async updateNotifications(@Param('id') id: number) {
		return this.communicationsNotificationsService.updateNotification(id)
	}

	@Post()
	create(
		@Body()
		createCommunicationsNotificationDto: CreateCommunicationsNotificationDto
	) {
		return this.communicationsNotificationsService.create(
			createCommunicationsNotificationDto
		)
	}

	@Get()
	findAll() {
		return this.communicationsNotificationsService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.communicationsNotificationsService.findOne(+id)
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body()
		updateCommunicationsNotificationDto: UpdateCommunicationsNotificationDto
	) {
		return this.communicationsNotificationsService.update(
			+id,
			updateCommunicationsNotificationDto
		)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.communicationsNotificationsService.remove(+id)
	}
}

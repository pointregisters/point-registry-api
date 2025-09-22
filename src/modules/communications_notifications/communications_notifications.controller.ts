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
import {
	ApiBody,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { DefaultUnauthorizedResponse } from '../common/swagger/DefaultUnauthorizedResponse'
import { DefaultForbiddenResponse } from '../common/swagger/DefaultForbiddenResponse'
import { DefaultInternalServerErrorResponse } from '../common/swagger/DefaultInternalServerErrorResponse'

@Controller('communications-notifications')
@ApiTags('Communications Notifications')
export class CommunicationsNotificationsController {
	constructor(
		private readonly communicationsNotificationsService: CommunicationsNotificationsService
	) {}

	@Get(':pis/quantity')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async getNotificationsQuantity(@Param('pis') pis: string) {
		const quantity =
			await this.communicationsNotificationsService.getNotificationsQuantity(
				pis
			)
		return { data: quantity }
	}

	@Get('read/:pis')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async getReadNotifications(@Param('pis') pis: string) {
		return this.communicationsNotificationsService.getReadNotifications(pis)
	}

	@Get('unread/:pis')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async getUnreadNotifications(@Param('pis') pis: string) {
		return this.communicationsNotificationsService.getUnreadNotifications(pis)
	}

	@Put(':id/update')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async updateNotifications(@Param('id') id: number) {
		return this.communicationsNotificationsService.updateNotification(id)
	}

	@Post()
	@ApiBody({ type: CreateCommunicationsNotificationDto })
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	create(
		@Body()
		createCommunicationsNotificationDto: CreateCommunicationsNotificationDto
	) {
		return this.communicationsNotificationsService.create(
			createCommunicationsNotificationDto
		)
	}

	@Get()
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	findAll() {
		return this.communicationsNotificationsService.findAll()
	}

	@Get(':id')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	findOne(@Param('id') id: string) {
		return this.communicationsNotificationsService.findOne(+id)
	}

	@Patch(':id')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
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
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	remove(@Param('id') id: string) {
		return this.communicationsNotificationsService.remove(+id)
	}
}

import { Module } from '@nestjs/common'
import { CommunicationsNotificationsService } from './communications_notifications.service'
import { CommunicationsNotificationsController } from './communications_notifications.controller'

@Module({
	controllers: [CommunicationsNotificationsController],
	providers: [CommunicationsNotificationsService]
})
export class CommunicationsNotificationsModule {}

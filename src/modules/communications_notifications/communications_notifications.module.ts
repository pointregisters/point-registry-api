import { Module } from '@nestjs/common'
import { CommunicationsNotificationsService } from './communications_notifications.service'
import { CommunicationsNotificationsController } from './communications_notifications.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommunicationNotification } from './entities/communications_notification.entity'

@Module({
	imports: [TypeOrmModule.forFeature([CommunicationNotification])],
	controllers: [CommunicationsNotificationsController],
	providers: [CommunicationsNotificationsService]
})
export class CommunicationsNotificationsModule {}

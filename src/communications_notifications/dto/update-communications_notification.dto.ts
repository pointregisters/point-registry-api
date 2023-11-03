import { PartialType } from '@nestjs/swagger'
import { CreateCommunicationsNotificationDto } from './create-communications_notification.dto'

export class UpdateCommunicationsNotificationDto extends PartialType(
	CreateCommunicationsNotificationDto
) {}

import { PartialType } from '@nestjs/swagger'
import { CreateRegisterQrcodeDto } from './create-register_qrcode.dto'

export class UpdateRegisterQrcodeDto extends PartialType(
	CreateRegisterQrcodeDto
) {}

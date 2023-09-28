import { Module } from '@nestjs/common'
import { RegisterQrcodeService } from './register_qrcode.service'
import { RegisterQrcodeController } from './register_qrcode.controller'

@Module({
	controllers: [RegisterQrcodeController],
	providers: [RegisterQrcodeService]
})
export class RegisterQrcodeModule {}

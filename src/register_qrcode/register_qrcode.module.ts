import { Module } from '@nestjs/common'
import { RegisterQrcodeService } from './register_qrcode.service'
import { RegisterQrcodeController } from './register_qrcode.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RegisterQrcode } from './entities/register_qrcode.entity'

@Module({
	imports: [TypeOrmModule.forFeature([RegisterQrcode])],
	controllers: [RegisterQrcodeController],
	providers: [RegisterQrcodeService]
})
export class RegisterQrcodeModule {}

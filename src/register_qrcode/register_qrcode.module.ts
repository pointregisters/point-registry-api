import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Movement } from 'src/movements/entities/movement.entity'

import { RegisterQrcode } from './entities/register_qrcode.entity'
import { RegisterQrcodeController } from './register_qrcode.controller'
import { RegisterQrcodeService } from './register_qrcode.service'

@Module({
	imports: [TypeOrmModule.forFeature([RegisterQrcode, Movement])],
	controllers: [RegisterQrcodeController],
	providers: [RegisterQrcodeService],
	exports: [RegisterQrcodeService]
})
export class RegisterQrcodeModule {}

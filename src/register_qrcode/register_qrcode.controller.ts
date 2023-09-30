import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query
} from '@nestjs/common'
import { RegisterQrcodeService } from './register_qrcode.service'
import { CreateRegisterQrcodeDto } from './dto/create-register_qrcode.dto'
import { UpdateRegisterQrcodeDto } from './dto/update-register_qrcode.dto'
import { RateLimit } from 'nestjs-rate-limiter'

@Controller('register-qrcode')
export class RegisterQrcodeController {
	constructor(private readonly registerQrcodeService: RegisterQrcodeService) {}

	@Get('check-qr-code')
	@RateLimit({
		keyPrefix: 'checkQRCode',
		points: 2,
		duration: 60, // 60 seconds
		errorMessage: 'Too many requests, please try again later.'
	})
	async checkQRCode(
		@Query('data') data: string[],
		@Query('pis') pis: string,
		@Query('region') region: string
	): Promise<any> {
		try {
			const result = await this.registerQrcodeService.checkQRCode(
				data,
				pis,
				region
			)
			return result
		} catch (error) {
			console.error(error)
			throw new Error('Error checking QRCode.')
		}
	}

	@Post()
	create(@Body() createRegisterQrcodeDto: CreateRegisterQrcodeDto) {
		return this.registerQrcodeService.create(createRegisterQrcodeDto)
	}

	@Get()
	findAll() {
		return this.registerQrcodeService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.registerQrcodeService.findOne(+id)
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateRegisterQrcodeDto: UpdateRegisterQrcodeDto
	) {
		return this.registerQrcodeService.update(+id, updateRegisterQrcodeDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.registerQrcodeService.remove(+id)
	}
}

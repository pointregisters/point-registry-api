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

import { RegisterQrcodeService } from './register_qrcode.service'
import { CreateRegisterQrcodeDto } from './dto/create-register_qrcode.dto'
import { UpdateRegisterQrcodeDto } from './dto/update-register_qrcode.dto'
import { RateLimit } from 'nestjs-rate-limiter'

@Controller('register-qrcode')
@ApiTags('Register Qrcode')
export class RegisterQrcodeController {
	constructor(private readonly registerQrcodeService: RegisterQrcodeService) {}

	@Get('check-qr-code')
	@RateLimit({
		keyPrefix: 'checkQRCode',
		points: 2,
		duration: 60, // 60 seconds
		errorMessage: 'Too many requests, please try again later.'
	})
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
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
	@ApiBody({ type: CreateRegisterQrcodeDto })
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	create(@Body() createRegisterQrcodeDto: CreateRegisterQrcodeDto) {
		return this.registerQrcodeService.create(createRegisterQrcodeDto)
	}

	@Get()
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	findAll() {
		return this.registerQrcodeService.findAll()
	}

	@Get(':id')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	findOne(@Param('id') id: string) {
		return this.registerQrcodeService.findOne(+id)
	}

	@Patch(':id')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	update(
		@Param('id') id: string,
		@Body() updateRegisterQrcodeDto: UpdateRegisterQrcodeDto
	) {
		return this.registerQrcodeService.update(+id, updateRegisterQrcodeDto)
	}

	@Delete(':id')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	remove(@Param('id') id: string) {
		return this.registerQrcodeService.remove(+id)
	}
}

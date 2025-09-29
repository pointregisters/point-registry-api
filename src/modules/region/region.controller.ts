import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete
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

import { RegionService } from './region.service'
import { CreateRegionDto } from './dto/create-region.dto'
import { UpdateRegionDto } from './dto/update-region.dto'

@Controller('region')
@ApiTags('Region')
export class RegionController {
	constructor(private readonly regionService: RegionService) {}

	@Post()
	@ApiBody({ type: CreateRegionDto })
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	create(@Body() createRegionDto: CreateRegionDto) {
		return this.regionService.create(createRegionDto)
	}

	@Get()
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async findAll() {
		return await this.regionService.findAll()
	}

	@Get(':id')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	findOne(@Param('id') id: string) {
		return this.regionService.findOne(+id)
	}

	@Patch(':id')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
		return this.regionService.update(+id, updateRegionDto)
	}

	@Delete(':id')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	remove(@Param('id') id: string) {
		return this.regionService.remove(+id)
	}
}

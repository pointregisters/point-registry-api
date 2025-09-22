import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpCode,
	HttpStatus,
	Inject,
	forwardRef,
	Request
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

import { TabletsCompaniesService } from './tablets-companies.service'
import { CreateTabletsCompanyDto } from './dto/create-tablets-company.dto'
import { UpdateTabletsCompanyDto } from './dto/update-tablets-company.dto'
import { TabletsCompany } from './entities/tablets-company.entity'
import { AuthService } from 'src/auth/auth.service'
import { IsPublic } from 'src/auth/decorators/is-public.decorator'

@Controller('tablets-companies')
@ApiTags('Tablets-Companies')
export class TabletsCompaniesController {
	constructor(
		private readonly tabletsCompaniesService: TabletsCompaniesService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService
	) {}

	@Post()
	@ApiBody({ type: CreateTabletsCompanyDto })
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async create(
		@Body() createTabletsCompanyDto: CreateTabletsCompanyDto
	): Promise<TabletsCompany> {
		return await this.tabletsCompaniesService.create(createTabletsCompanyDto)
	}

	@Get()
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async findAll(): Promise<TabletsCompany[]> {
		return await this.tabletsCompaniesService.findAll()
	}

	@Get(':id')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async findOne(@Param('id') id: string): Promise<TabletsCompany> {
		return await this.tabletsCompaniesService.findOne(+id)
	}

	@Patch(':id')
	@ApiBody({ type: UpdateTabletsCompanyDto })
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async update(
		@Param('id') id: string,
		@Body() updateTabletsCompanyDto: UpdateTabletsCompanyDto
	): Promise<void> {
		return await this.tabletsCompaniesService.update(
			+id,
			updateTabletsCompanyDto
		)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async remove(@Param('id') id: string): Promise<void> {
		return await this.tabletsCompaniesService.remove(+id)
	}

	@Get('verify-tablet/:uuid')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async verifyTablet(@Param('uuid') uuid: string) {
		const result =
			await this.tabletsCompaniesService.findTabletsCompanyByUuid(uuid)

		// Se encontrou o tablet e está ativo, gere o token
		if (result && result.id) {
			// Crie um objeto mock para o login do tablet
			const mockTablet = {
				id: result.id,
				registration: `tablet-${result.id}` // Usando um registration fictício para tablets
			} as any

			const token = await this.authService.login(mockTablet)
			return {
				...result,
				token: token.access_token
			}
		}

		return result
	}

	@IsPublic()
	@Post('/validate-tablet')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async validateTablet(@Body() body: { uuid: string; token: string }) {
		const { uuid, token } = body
		const tablet = await this.tabletsCompaniesService.validateTablet(
			uuid,
			token
		)

		// Se a validação foi bem-sucedida e o tablet foi ativado, gere o token
		if (tablet && tablet.id) {
			// Crie um objeto mock para o login do tablet
			const mockTablet = {
				id: tablet.id,
				registration: `tablet-${tablet.id}` // Usando um registration fictício para tablets
			} as any

			const jwtToken = await this.authService.login(mockTablet)
			return {
				...tablet,
				token: jwtToken.access_token
			}
		}

		return tablet
	}

	@Post('/validateID')
	@ApiUnauthorizedResponse(DefaultUnauthorizedResponse)
	@ApiForbiddenResponse(DefaultForbiddenResponse)
	@ApiInternalServerErrorResponse(DefaultInternalServerErrorResponse)
	async validateID(
		@Body() body: { id: string; token: string; region: string }
	) {
		const { id, token, region } = body
		try {
			const result = await this.tabletsCompaniesService.validateID(
				id,
				token,
				region
			)
			return result
		} catch (error) {
			console.error(error)
			throw new Error('Erro ao validar ID.')
		}
	}
}

import { Controller, Get, Header } from '@nestjs/common'

import { AppService } from './app.service'
import { CurrentUser } from './auth/decorators/current-user.decorator'
import { Employee } from './modules/employees/entities/employee.entity'
import { IsPublic } from './auth/decorators/is-public.decorator'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@IsPublic()
	@Get()
	@Header('Content-Type', 'text/html')
	getHTMLWelcome(): string {
		return this.appService.getHTMLWelcome()
	}

	@IsPublic()
	@Get('/me')
	getMe(@CurrentUser() currentUser: Employee) {
		return currentUser
	}

	@IsPublic()
	@Get('/health')
	getHealth(): any {
		return {
			status: 'healthy',
			timestamp: new Date().toISOString(),
			uptime: `${process.uptime().toFixed(2)} seconds`,
			service: 'Point Registry API',
			version: this.appService['configService'].get<string>('version'),
			environment: process.env.NODE_ENV || 'development',
			// Informações do sistema
			memory: {
				used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
				total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`
			},
			node: {
				version: process.version,
				platform: process.platform
			},
			// Links úteis
			links: {
				documentation: '/docs',
				api_status: '/',
				readiness_check: '/health/ready',
				liveness_check: '/health/live'
			}
		}
	}

	@IsPublic()
	@Get('/health/ready')
	getReadiness(): any {
		// Para Kubernetes e load balancers
		return {
			status: 'ready',
			timestamp: new Date().toISOString(),
			message: 'Application is ready to receive traffic'
		}
	}

	@IsPublic()
	@Get('/health/live')
	getLiveness(): any {
		// Para Kubernetes - verificação mais simples
		return {
			status: 'alive',
			timestamp: new Date().toISOString()
		}
	}
}

import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { CustomLogger } from '../logger/custom-logger.service'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(private readonly logger: CustomLogger) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest()
		const { method, url, body, query, params, headers } = request
		const userAgent = headers['user-agent'] || ''
		const ip = headers['x-forwarded-for'] || request.connection.remoteAddress

		const now = Date.now()

		this.logger.http(`Incoming Request: ${method} ${url}`, {
			ip,
			userAgent,
			body: this.sanitizeBody(body),
			query,
			params
		})

		return next.handle().pipe(
			tap({
				next: (data) => {
					const response = context.switchToHttp().getResponse()
					const delay = Date.now() - now

					if (delay > 1000) {
						this.logger.warn(
							`Slow request detected: ${method} ${url} - ${delay}ms`,
							'PERFORMANCE'
						)
					}

					const responseSize = JSON.stringify(data)?.length || 0

					this.logger.http(
						`Response: ${method} ${url} - Status: ${response.statusCode}`,
						{
							delay: `${delay}ms`,
							statusCode: response.statusCode,
							responseSize: `${responseSize} bytes`
						}
					)
				},
				error: (error) => {
					const delay = Date.now() - now
					const statusCode = error.status || 500

					this.logger.error(
						`Error: ${method} ${url} - Status: ${statusCode}`,
						error.stack,
						'HTTP'
					)

					this.logger.http(
						`Response: ${method} ${url} - Status: ${statusCode}`,
						{
							delay: `${delay}ms`,
							statusCode,
							error: error.message
						}
					)
				}
			})
		)
	}

	private sanitizeBody(body: any): any {
		if (!body) return body

		const sanitized = { ...body }
		const sensitiveFields = [
			'password',
			'senha',
			'token',
			'authorization',
			'cpf',
			'pis'
		]

		sensitiveFields.forEach((field) => {
			if (sanitized[field]) {
				sanitized[field] = '***REDACTED***'
			}
		})

		return sanitized
	}
}

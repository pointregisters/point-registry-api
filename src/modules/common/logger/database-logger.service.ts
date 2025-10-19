import { Injectable } from '@nestjs/common'
import { CustomLogger } from './custom-logger.service'

@Injectable()
export class DatabaseLoggerService {
	constructor(private readonly logger: CustomLogger) {
		this.logger.setContext('DATABASE')
	}

	logQuery(query: string, parameters?: any[]) {
		const meta = {
			type: 'QUERY',
			query: this.shortenQuery(query),
			parameters: this.sanitizeParameters(parameters)
		}
		this.logger.database('Executing query', meta)
	}

	logQueryError(error: string, query: string, parameters?: any[]) {
		this.logger.error(`Query failed: ${error}`, undefined, 'DATABASE')

		const meta = {
			type: 'QUERY_ERROR',
			query: this.shortenQuery(query),
			parameters: this.sanitizeParameters(parameters),
			error: error
		}
		this.logger.database('Failed query', meta)
	}

	logQuerySlow(time: number, query: string, parameters?: any[]) {
		this.logger.warn(`Slow query detected: ${time}ms`, 'DATABASE')

		const meta = {
			type: 'SLOW_QUERY',
			query: this.shortenQuery(query),
			parameters: this.sanitizeParameters(parameters),
			executionTime: `${time}ms`
		}
		this.logger.database('Slow query', meta)
	}

	logMigration(message: string) {
		this.logger.verbose(`Migration: ${message}`, 'DATABASE')
	}

	logSchemaBuild(message: string) {
		this.logger.verbose(`Schema build: ${message}`, 'DATABASE')
	}

	log(level: 'log' | 'info' | 'warn', message: any) {
		// Converte mensagens de log do TypeORM
		const logMessage =
			typeof message === 'string' ? message : JSON.stringify(message)

		switch (level) {
			case 'log':
			case 'info':
				this.logger.info(logMessage, 'DATABASE')
				break
			case 'warn':
				this.logger.warn(logMessage, 'DATABASE')
				break
			default:
				this.logger.info(logMessage, 'DATABASE')
		}
	}

	private shortenQuery(query: string): string {
		if (!query) return query
		return query.length > 500 ? query.substring(0, 500) + '...' : query
	}

	private sanitizeParameters(parameters?: any[]): any[] {
		if (!parameters) return parameters

		return parameters.map((param) => {
			if (
				typeof param === 'string' &&
				(param.includes('password') || param.includes('token'))
			) {
				return '***REDACTED***'
			}
			return param
		})
	}
}

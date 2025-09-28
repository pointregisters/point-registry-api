import { Injectable, LoggerService } from '@nestjs/common'
import * as winston from 'winston'
import * as moment from 'moment-timezone'

@Injectable()
export class CustomLogger implements LoggerService {
	private readonly logger: winston.Logger
	private context = 'Application'

	constructor() {
		this.logger = winston.createLogger({
			level: process.env.LOG_LEVEL || 'info',
			format: winston.format.combine(
				winston.format.timestamp({
					format: () =>
						moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss.SSS')
				}),
				winston.format.errors({ stack: true }),
				winston.format.json()
			),
			defaultMeta: { service: 'point-registry-api' },
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.colorize(),
						winston.format.printf(
							({ timestamp, level, message, context, ...meta }) => {
								const contextTag = context
									? `[${context}]`
									: `[${this.context}]`

								// Se message for um objeto, converte para string
								const messageText =
									typeof message === 'string'
										? message
										: JSON.stringify(message)

								let log = `[${timestamp}] ${level}\t${contextTag} ${messageText}`

								// Adiciona metadados extras se existirem
								const cleanMeta = { ...meta }
								delete cleanMeta.context
								delete cleanMeta.service

								if (Object.keys(cleanMeta).length > 0) {
									log += ` - ${JSON.stringify(cleanMeta)}`
								}

								return log
							}
						)
					)
				}),
				new winston.transports.File({
					filename: 'logs/error.log',
					level: 'error',
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.json()
					)
				}),
				new winston.transports.File({
					filename: 'logs/combined.log',
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.json()
					)
				})
			]
		})
	}

	setContext(context: string) {
		this.context = context
	}

	// Métodos corrigidos - aceitam apenas string como primeiro parâmetro
	log(message: string, context?: string) {
		const contextToUse = context || this.context
		this.logger.info(message, { context: contextToUse })
	}

	error(message: string, trace?: string, context?: string) {
		const contextToUse = context || this.context
		this.logger.error(message, { trace, context: contextToUse })
	}

	warn(message: string, context?: string) {
		const contextToUse = context || this.context
		this.logger.warn(message, { context: contextToUse })
	}

	debug(message: string, context?: string) {
		const contextToUse = context || this.context
		this.logger.debug(message, { context: contextToUse })
	}

	verbose(message: string, context?: string) {
		const contextToUse = context || this.context
		this.logger.verbose(message, { context: contextToUse })
	}

	// Métodos específicos - agora formatam a mensagem corretamente
	http(message: string, meta?: any) {
		const metaString = meta ? ` - ${JSON.stringify(meta)}` : ''
		this.logger.info(`${message}${metaString}`, { context: 'HTTP' })
	}

	database(message: string, meta?: any) {
		const metaString = meta ? ` - ${JSON.stringify(meta)}` : ''
		this.logger.debug(`${message}${metaString}`, { context: 'DATABASE' })
	}

	business(message: string, meta?: any) {
		const metaString = meta ? ` - ${JSON.stringify(meta)}` : ''
		this.logger.info(`${message}${metaString}`, { context: 'BUSINESS' })
	}

	security(message: string, meta?: any) {
		const metaString = meta ? ` - ${JSON.stringify(meta)}` : ''
		this.logger.warn(`${message}${metaString}`, { context: 'SECURITY' })
	}

	info(message: string, context?: string) {
		const contextToUse = context || this.context
		this.logger.info(message, { context: contextToUse })
	}
}

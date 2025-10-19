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

								// CORREÇÃO: Lidar com mensagens que são objetos (logs do NestJS)
								let messageText: string
								if (typeof message === 'string') {
									messageText = message
								} else if (message && typeof message === 'object') {
									// Se for um objeto com propriedades 0,1,2... (como "InstanceLoader")
									if (message['0'] !== undefined) {
										messageText = Object.values(message).join('')
									} else {
										messageText = JSON.stringify(message)
									}
								} else {
									messageText = String(message)
								}

								let log = `[${timestamp}] ${level}\t${contextTag} ${messageText}`

								// Adiciona metadados extras se existirem (apenas para nossos logs customizados)
								const cleanMeta = { ...meta }
								delete cleanMeta.context
								delete cleanMeta.service

								// Só mostra meta se não for um log interno do NestJS
								const isNestInternalLog =
									messageText.includes('InstanceLoader') ||
									messageText.includes('RoutesResolver') ||
									messageText.includes('RouterExplorer') ||
									messageText.includes('NestFactory') ||
									messageText.includes('NestApplication')

								if (!isNestInternalLog && Object.keys(cleanMeta).length > 0) {
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

	// Métodos para logs do NestJS (mantém compatibilidade)
	log(message: any, context?: string) {
		this.handleLog('info', message, undefined, context)
	}

	error(message: any, trace?: string, context?: string) {
		this.handleLog('error', message, trace, context)
	}

	warn(message: string, meta?: any, context?: string) {
		const contextToUse = context || this.context
		this.logger.warn(message, { ...meta, context: contextToUse })
	}

	debug(message: any, context?: string) {
		this.handleLog('debug', message, undefined, context)
	}

	verbose(message: any, context?: string) {
		this.handleLog('verbose', message, undefined, context)
	}

	// Método auxiliar para processar logs
	private handleLog(
		level: string,
		message: any,
		trace?: string,
		context?: string
	) {
		const contextToUse = context || this.context

		if (typeof message === 'object') {
			if (message['0'] !== undefined) {
				const messageText = Object.values(message).join('')
				this.logger.log(level, messageText, { context: contextToUse, trace })
			} else {
				// Para objetos com metadados explícitos
				if (message.message && message.meta) {
					this.logger.log(level, message.message, {
						...message.meta,
						context: contextToUse,
						trace
					})
				} else {
					this.logger.log(level, JSON.stringify(message), {
						context: contextToUse,
						trace
					})
				}
			}
		} else {
			this.logger.log(level, message, { context: contextToUse, trace })
		}
	}

	// Métodos específicos para nossos logs customizados
	http(message: string, meta?: any) {
		this.logger.info(message, { ...meta, context: 'HTTP' })
	}

	database(message: string, meta?: any) {
		this.logger.debug(message, { ...meta, context: 'DATABASE' })
	}

	business(message: string, meta?: any) {
		this.logger.info(message, { ...meta, context: 'BUSINESS' })
	}

	security(message: string, meta?: any) {
		this.logger.warn(message, { ...meta, context: 'SECURITY' })
	}

	info(message: string, meta?: any, context?: string) {
		const contextToUse = context || this.context
		this.logger.info(message, { ...meta, context: contextToUse })
	}
}

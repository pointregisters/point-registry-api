import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { CustomLogger } from './modules/common/logger/custom-logger.service'
import { LoggingInterceptor } from './modules/common/interceptors/logging.interceptor'
import { ExceptionFilters } from './modules/common/filters/exception.filter'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true
	})

	// Usar o logger customizado
	const logger = app.get(CustomLogger)
	app.useLogger(logger)

	// Interceptor global para logging de requisições
	app.useGlobalInterceptors(new LoggingInterceptor(logger))

	// Filtro global para exceções
	app.useGlobalFilters(new ExceptionFilters(logger))

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true
		})
	)

	const config = new DocumentBuilder()
		.addSecurity('bearer', {
			type: 'http',
			scheme: 'bearer'
		})
		.setTitle('Point Registry API')
		.setDescription('Point Registry API')
		.setVersion('1.1.2')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('docs', app, document)

	app.enableCors()

	const PORT = process.env.PORT ?? 3000

	await app.listen(PORT, '0.0.0.0')

	logger.log(`🚀 Application is running on: ${await app.getUrl()}`, 'Bootstrap')
}

bootstrap().catch((e) => {
	console.error('Failed to start application:', e)
})

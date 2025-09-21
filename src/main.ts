import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
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

	console.log(`[🤖]: Application is running on: ${await app.getUrl()}`)
}

bootstrap().catch((e) => {
	console.log(e)
})
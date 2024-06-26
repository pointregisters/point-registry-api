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
		.setTitle('Point Registry API')
		.setDescription('Point Registry API')
		.setVersion('1.1.2')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)
	app.enableCors()

	await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000)
}
bootstrap()

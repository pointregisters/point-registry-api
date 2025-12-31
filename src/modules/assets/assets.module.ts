import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AssetsController } from './assets.controller'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '..', '..', 'assets'),
			serveRoot: '/assets',
			serveStaticOptions: {
				index: false,
				redirect: false
			}
		})
	],
	controllers: [AssetsController]
})
export class AssetsModule {}

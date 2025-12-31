import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common'
import { Response } from 'express'
import { join } from 'path'
import { existsSync, readdirSync } from 'fs'
import { IsPublic } from '../../auth/decorators/is-public.decorator'

@Controller('assets')
export class AssetsController {
	private readonly assetsPath = join(process.cwd(), 'assets')

	@IsPublic()
	@Get('photos_taken/:filename')
	getPhoto(@Param('filename') filename: string, @Res() res: Response) {
		const filePath = join(this.assetsPath, 'photos_taken', filename)

		if (!existsSync(filePath)) {
			throw new NotFoundException('Image not found')
		}

		const ext = filename.split('.').pop().toLowerCase()
		let contentType = 'application/octet-stream'

		switch (ext) {
			case 'png':
				contentType = 'image/png'
				break
			case 'jpg':
			case 'jpeg':
				contentType = 'image/jpeg'
				break
			case 'gif':
				contentType = 'image/gif'
				break
			case 'webp':
				contentType = 'image/webp'
				break
		}

		res.setHeader('Content-Type', contentType)
		res.setHeader('Cache-Control', 'public, max-age=86400') // Cache por 24 horas

		return res.sendFile(filePath)
	}

	@IsPublic()
	@Get('photos_taken')
	listPhotos() {
		try {
			const photosPath = join(this.assetsPath, 'photos_taken')
			const files = readdirSync(photosPath)

			return {
				count: files.length,
				photos: files.map((filename) => ({
					filename,
					url: `/assets/photos_taken/${filename}`
				}))
			}
		} catch (error) {
			return {
				count: 0,
				photos: [],
				error: 'Photos directory not found'
			}
		}
	}
}

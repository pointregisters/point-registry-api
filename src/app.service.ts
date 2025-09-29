import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IsPublic } from './auth/decorators/is-public.decorator'

@Injectable()
export class AppService {
	constructor(private readonly configService: ConfigService) {}

	@IsPublic()
	getHTMLWelcome(): string {
		const version = this.configService.get<string>('version')
		const appName = this.configService.get<string>('appName')

		return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${appName} v${version}</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px; 
                background-color: #f5f5f5;
            }
            .container { 
                background: white; 
                padding: 30px; 
                border-radius: 10px; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #333; }
            .status { 
                color: green; 
                font-weight: bold;
            }
            .link { 
                display: inline-block; 
                margin: 10px 0; 
                padding: 10px 15px; 
                background: #007bff; 
                color: white; 
                text-decoration: none; 
                border-radius: 5px;
            }
            .link:hover { background: #0056b3; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 ${appName}</h1>
            <p><strong>Versão:</strong> ${version}</p>
            <p><strong>Status:</strong> <span class="status">Online</span></p>
            <p><strong>Descrição:</strong> Sistema de controle de ponto eletrônico</p>
            
            <h2>📚 Documentação</h2>
            <a href="/docs" class="link">🔗 Acessar Swagger UI</a>
            
            <h2>🔗 Links Úteis</h2>
            <a href="/health" class="link">❤️ Health Check</a>
            <a href="https://www.pointregisters.com.br/" class="link">ℹ️ Site</a>
            
            <h2>⏰ Timestamp</h2>
            <p>${new Date().toISOString()}</p>
        </div>
    </body>
    </html>
		`
	}
}

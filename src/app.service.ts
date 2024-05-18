import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
	getStatus(): string {
		return 'Pointregisters - API! - Running successfully v.1.1.2'
	}
}

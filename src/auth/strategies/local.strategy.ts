import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'
import { PassportStrategy } from '@nestjs/passport'
import { MessagesHelper } from 'src/modules/common/helpers/messages.helper'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({ usernameField: 'email' })
	}

	async validate(email: string, password: string) {
		const user = await this.authService.validateUser(email, password)

		if (!user)
			throw new UnauthorizedException(MessagesHelper.PASSWORD_OR_EMAIL_INVALID)

		return user
	}
}

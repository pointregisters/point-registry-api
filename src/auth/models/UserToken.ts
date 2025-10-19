export interface UserToken {
	access_token: string
	sub: number
	email: string
	userType?: string
	role?: UserRole
}

export enum UserRole {
	USER = 'user',
	ADMIN = 'admin'
}

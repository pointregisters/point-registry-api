export interface UserPayload {
	sub: number
	email: string
	registration: string
	role?: UserRole
	iat?: number
	exp?: number
}

export enum UserRole {
	USER = 'user',
	ADMIN = 'admin'
}

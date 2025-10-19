import { ApiProperty } from '@nestjs/swagger'
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('tablets_companies')
export class TabletsCompany {
	@PrimaryGeneratedColumn()
	@ApiProperty()
	id: number

	@Column({ name: 'companie_id' })
	@ApiProperty()
	companyId: string

	@Column()
	@ApiProperty()
	matriz: number

	@Column()
	@ApiProperty()
	token: string

	@Column()
	@ApiProperty()
	terminal: string

	@Column()
	@ApiProperty()
	uuid: string

	@Column({ default: false })
	@ApiProperty()
	status: boolean

	@Column({ name: 'data_instalacao', default: null })
	@ApiProperty()
	dataInstalacao: Date

	@Column({
		name: 'data_registro'
	})
	@ApiProperty()
	dataRegistro: Date

	@BeforeInsert()
	generateFields() {
		this.token = this.generateRandomToken()
		this.dataRegistro = new Date()
	}

	generateRandomToken() {
		const tokenLength = 11
		let token = ''

		for (let i = 0; i < tokenLength; i++) {
			const randomNumber = Math.floor(Math.random() * 10) // Gera um número aleatório de 0 a 9
			token += randomNumber.toString()
		}

		return token
	}
}

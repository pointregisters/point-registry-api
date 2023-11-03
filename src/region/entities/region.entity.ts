import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('region')
export class Region {
	@PrimaryGeneratedColumn()
	@ApiProperty()
	id: number

	@Column()
	@ApiProperty()
	description: string

	@Column()
	@ApiProperty()
	cidade: string

	@Column()
	@ApiProperty()
	status: string
}

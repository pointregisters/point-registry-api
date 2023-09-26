import { ApiProperty } from '@nestjs/swagger'
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm'

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

	@Column({ default: true })
	@ApiProperty()
	status: boolean

	@Column({ name: 'data_instalacao', default: null })
	@ApiProperty()
	dataInstalacao: Date

	@CreateDateColumn({
		type: 'timestamp',
		name: 'data_registro',
		default: () => 'CURRENT_TIMESTAMP(6)'
	})
	@ApiProperty()
	dataRegistro: Date
}

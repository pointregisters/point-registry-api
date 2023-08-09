import { ApiProperty } from '@nestjs/swagger'
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

@Entity()
export class Company {
	@PrimaryGeneratedColumn()
	@ApiProperty()
	id: number

	@Column({ name: 'razao_social' })
	@ApiProperty()
	razaoSocial: string

	@Column()
	@ApiProperty()
	cnpj: string

	@Column()
	@ApiProperty()
	type: number

	@Column({ name: 'id_matriz' })
	@ApiProperty()
	matrizId: number

	@Column()
	@ApiProperty()
	matriz: number

	@Column()
	@ApiProperty()
	token: string

	@CreateDateColumn({
		type: 'timestamp',
		name: 'create_at',
		default: () => 'CURRENT_TIMESTAMP(6)'
	})
	@ApiProperty()
	createAt: Date

	@UpdateDateColumn({
		type: 'timestamp',
		name: 'update_at',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)'
	})
	@ApiProperty()
	updateAt: Date

	@DeleteDateColumn({
		type: 'timestamp',
		name: 'deleted_at'
	})
	@ApiProperty()
	deletedAt: Date
}

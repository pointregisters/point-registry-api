import { ApiProperty } from '@nestjs/swagger'
import { Employee } from 'src/employees/entities/employee.entity'
import { Movement } from 'src/movements/entities/movement.entity'
import { TabletsCompany } from 'src/tablets-companies/entities/tablets-company.entity'
import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

import { v4 as uuidv4 } from 'uuid'

export enum Type {
	MATRIZ = 'matriz',
	FILIAL = 'filial'
}

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

	@Column({ type: 'varchar', default: Type.MATRIZ, name: 'type' })
	@ApiProperty()
	type: Type

	@Column({ name: 'id_matriz' })
	@ApiProperty()
	matrizId: number

	@Column()
	@ApiProperty()
	matriz: number

	@Column()
	@ApiProperty()
	token: string

	@OneToMany(() => Employee, (employee) => employee.company)
	employee: Employee[]

	@OneToMany(() => TabletsCompany, (tabletsCompany) => tabletsCompany.company)
	tabletsCompany: TabletsCompany[]

	@OneToMany(() => Movement, (movement) => movement.company)
	movements: Movement[]

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

	@BeforeInsert()
	generateToken() {
		this.token = uuidv4()
	}
}

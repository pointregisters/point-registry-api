import { Company } from 'src/companies/entities/company.entity'
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn
} from 'typeorm'

@Entity('register_qrcode')
export class RegisterQrcode {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'text' })
	token: string

	@Column({ type: 'varchar', length: 100 })
	cnpj: string

	@Column({ type: 'datetime', nullable: true })
	register: Date

	@Column({ type: 'int' })
	status_qrcode: number

	@ManyToOne(() => Company)
	@JoinColumn({ name: 'companie_id' })
	company: Company

	@Column({ type: 'int', nullable: true })
	matriz: number

	@Column({ type: 'varchar', length: 200, nullable: true })
	companie_md5: string

	@Column({ type: 'varchar', length: 200, nullable: true })
	matriz_md5: string

	@Column({ type: 'varchar', length: 200, nullable: true })
	register_md5: string
}

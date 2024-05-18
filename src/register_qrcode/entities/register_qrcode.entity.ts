import { Company } from 'src/companies/entities/company.entity'
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
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

	@Column({ type: 'int', name: 'status_qrcode' })
	statusQrCode: number

	@ManyToOne(() => Company)
	@JoinColumn({ name: 'companie_id' })
	company: Company

	@Column({ type: 'int', nullable: true })
	matriz: number

	@Column({
		type: 'varchar',
		length: 200,
		nullable: true,
		name: 'companie_md5'
	})
	companyMd5: string

	@Column({
		type: 'varchar',
		length: 200,
		nullable: true,
		name: 'matriz_md5'
	})
	matrizMd5: string

	@Column({
		type: 'varchar',
		length: 200,
		nullable: true,
		name: 'register_md5'
	})
	registerMd5: string
}

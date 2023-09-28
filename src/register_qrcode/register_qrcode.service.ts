import { Injectable } from '@nestjs/common'
import { CreateRegisterQrcodeDto } from './dto/create-register_qrcode.dto'
import { UpdateRegisterQrcodeDto } from './dto/update-register_qrcode.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { RegisterQrcode } from './entities/register_qrcode.entity'
import { Repository } from 'typeorm'
import moment from 'moment-timezone'

@Injectable()
export class RegisterQrcodeService {
	constructor(
		@InjectRepository(RegisterQrcode)
		private readonly registerQrcodeRepository: Repository<RegisterQrcode>
	) {}

	async checkQRCode(data: string[], pis: string, region: string): Promise<any> {
		try {
			const result = await this.registerQrcodeRepository
				.createQueryBuilder('rq')
				.select([
					'rq.matriz as qr_code_matriz',
					'rq.companie_id as qr_code_companie_id'
				])
				.innerJoin('employees', 'emp', 'rq.matriz = emp.matriz')
				.where('rq.companie_md5 = :data0', { data0: data[0] })
				.andWhere('rq.matriz_md5 = :data1', { data1: data[1] })
				.andWhere('rq.register_md5 = :data2', { data2: data[2] })
				.andWhere('emp.pis = :pis', { pis })
				.getRawOne()

			if (result) {
				const check = await this.registerQrcodeRepository
					.createQueryBuilder('mov')
					.where('mov.employee_pis = :pis', { pis })
					.andWhere('TIMESTAMPDIFF(MINUTE, mov.register, :currentTime) < 2', {
						currentTime: moment().tz(region).format('YYYY-MM-DD HH:mm:ss')
					})
					.orderBy('mov.register', 'DESC')
					.limit(1)
					.getRawOne()

				if (!check) {
					return { data: result, status: 'success' }
				} else {
					return {
						data: 'Aguarde 2 minutos \n\n Último ponto registrado:',
						date: moment(check.register).format('DD/MM/YYYY'),
						hour: moment(check.register).format('HH:mm'),
						status: 'wait'
					}
				}
			} else {
				return { data: 'QRCode inválido', status: 'error' }
			}
		} catch (error) {
			throw error
		}
	}

	create(createRegisterQrcodeDto: CreateRegisterQrcodeDto) {
		return 'This action adds a new registerQrcode'
	}

	findAll() {
		return `This action returns all registerQrcode`
	}

	findOne(id: number) {
		return `This action returns a #${id} registerQrcode`
	}

	update(id: number, updateRegisterQrcodeDto: UpdateRegisterQrcodeDto) {
		return `This action updates a #${id} registerQrcode`
	}

	remove(id: number) {
		return `This action removes a #${id} registerQrcode`
	}
}

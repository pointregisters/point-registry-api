import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as moment from 'moment-timezone'
import { Movement } from 'src/modules/movements/entities/movement.entity'
import { Repository } from 'typeorm'

import { CreateRegisterQrcodeDto } from './dto/create-register_qrcode.dto'
import { UpdateRegisterQrcodeDto } from './dto/update-register_qrcode.dto'
import { RegisterQrcode } from './entities/register_qrcode.entity'

@Injectable()
export class RegisterQrcodeService {
	constructor(
		@InjectRepository(RegisterQrcode)
		private readonly registerQrcodeRepository: Repository<RegisterQrcode>,
		@InjectRepository(Movement)
		private readonly movementRepository: Repository<Movement>
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
				const now = moment().tz(region).format('YYYY-MM-DD HH:mm:ss')
				const check = await this.verifyLastMovement(pis, now)

				if (!check) {
					return { data: result, status: 'success' }
				} else {
					return {
						data: null,
						msg: 'Aguarde 2 minutos \n\n Último ponto registrado:',
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

	async findAll() {
		return await this.registerQrcodeRepository.find()
	}

	async findOne(id: number) {
		return await this.registerQrcodeRepository.findOne({
			where: {
				id
			}
		})
	}

	private async verifyLastMovement(pis: string, now: string) {
		return await this.movementRepository
			.createQueryBuilder('movement')
			.where('movement.employeePis = :pis', { pis })
			.andWhere('TIMESTAMPDIFF(MINUTE, movement.register, :now) < 2', { now })
			.orderBy('movement.register', 'DESC')
			.limit(1)
			.getOne()
	}

	update(id: number, updateRegisterQrcodeDto: UpdateRegisterQrcodeDto) {
		return `This action updates a #${id} registerQrcode`
	}

	remove(id: number) {
		return `This action removes a #${id} registerQrcode`
	}
}

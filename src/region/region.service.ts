import { Injectable } from '@nestjs/common'
import { CreateRegionDto } from './dto/create-region.dto'
import { UpdateRegionDto } from './dto/update-region.dto'
import { Region } from './entities/region.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class RegionService {
	constructor(
		@InjectRepository(Region)
		private readonly repository: Repository<Region>
	) {}
	create(createRegionDto: CreateRegionDto) {
		return 'This action adds a new region'
	}

	async findAll() {
		return await this.repository.find({
			select: ['id', 'description', 'cidade', 'status']
		})
	}

	async findOne(id: number) {
		return await this.repository.find({
			select: ['id', 'description', 'cidade', 'status'],
			where: { id }
		})
	}

	update(id: number, updateRegionDto: UpdateRegionDto) {
		return `This action updates a #${id} region`
	}

	remove(id: number) {
		return `This action removes a #${id} region`
	}
}

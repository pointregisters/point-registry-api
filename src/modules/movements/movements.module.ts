import { Module } from '@nestjs/common'
import { MovementsService } from './movements.service'
import { MovementsController } from './movements.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Movement } from './entities/movement.entity'
import { AwsS3Module } from 'src/aws-s3/aws-s3.module'
import { EmployeesModule } from 'src/modules/employees/employees.module'

@Module({
	imports: [TypeOrmModule.forFeature([Movement]), AwsS3Module, EmployeesModule],
	controllers: [MovementsController],
	providers: [MovementsService],
	exports: [MovementsService]
})
export class MovementsModule {}

import { Injectable } from '@nestjs/common';
import { CreateConentDistributionDto } from './dto/create-conent-distribution.dto';
import { UpdateConentDistributionDto } from './dto/update-conent-distribution.dto';

@Injectable()
export class ConentDistributionService {
  create(createConentDistributionDto: CreateConentDistributionDto) {
    return 'This action adds a new conentDistribution';
  }

  findAll() {
    return `This action returns all conentDistribution`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conentDistribution`;
  }

  update(id: number, updateConentDistributionDto: UpdateConentDistributionDto) {
    return `This action updates a #${id} conentDistribution`;
  }

  remove(id: number) {
    return `This action removes a #${id} conentDistribution`;
  }
}

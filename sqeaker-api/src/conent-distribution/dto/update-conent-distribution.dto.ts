import { PartialType } from '@nestjs/mapped-types';
import { CreateConentDistributionDto } from './create-conent-distribution.dto';

export class UpdateConentDistributionDto extends PartialType(CreateConentDistributionDto) {
  id: number;
}

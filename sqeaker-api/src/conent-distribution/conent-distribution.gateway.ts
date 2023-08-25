import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ConentDistributionService } from './conent-distribution.service';
import { CreateConentDistributionDto } from './dto/create-conent-distribution.dto';
import { UpdateConentDistributionDto } from './dto/update-conent-distribution.dto';

@WebSocketGateway(3002)
export class ConentDistributionGateway {
  constructor(
    private readonly conentDistributionService: ConentDistributionService,
  ) {}

  @SubscribeMessage('createConentDistribution')
  create(
    @MessageBody() createConentDistributionDto: CreateConentDistributionDto,
  ) {
    return this.conentDistributionService.create(createConentDistributionDto);
  }

  @SubscribeMessage('findAllConentDistribution')
  findAll() {
    return this.conentDistributionService.findAll();
  }

  @SubscribeMessage('findOneConentDistribution')
  findOne(@MessageBody() id: number) {
    return this.conentDistributionService.findOne(id);
  }

  @SubscribeMessage('updateConentDistribution')
  update(
    @MessageBody() updateConentDistributionDto: UpdateConentDistributionDto,
  ) {
    return this.conentDistributionService.update(
      updateConentDistributionDto.id,
      updateConentDistributionDto,
    );
  }

  @SubscribeMessage('removeConentDistribution')
  remove(@MessageBody() id: number) {
    return this.conentDistributionService.remove(id);
  }
}

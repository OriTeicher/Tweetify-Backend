import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SerializeInterceptor } from 'src/common/serialize/serialize.interceptor';
import { User } from './entities/user.entity';

@UseInterceptors(new SerializeInterceptor(User))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): User {}

  @Get()
  findAll(): User[] {}

  @Get(':id')
  findOne(@Param('id') id: string): User {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User {}

  @Delete(':id')
  remove(@Param('id') id: string): User {}
}

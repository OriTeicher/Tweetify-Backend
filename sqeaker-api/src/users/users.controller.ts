import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'src/comments/dto/pagination-query.dto';
import { JwtAuthGuard } from 'src/iam/auth/guards/jwt-auth.guard';
import { CacheInterceptor } from 'src/cache/cache.interceptor';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll(@Req() req, @Query() paginationQueryDto: PaginationQueryDto) {
    return this.usersService.findAll(paginationQueryDto);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/search')
  search(@Query('q') text: string) {
    return this.usersService.search(text);
  }

  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreateUserDto } from '../dtos/create-user.dto';
import { RolesEnum } from '../enums/roles.enum';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.Admin)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}

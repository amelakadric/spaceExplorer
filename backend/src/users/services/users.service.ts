import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../shared/database/repostitories/users.repository';
import { User } from '../../shared/database/schemas/user.schema';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    return this.usersRepository.create(createUserDto, file);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOneById(id: string): Promise<User> {
    return this.usersRepository.findOneById(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneByEmail(email);
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    return this.usersRepository.update(id, updateUserDto);
  }

  async delete(id: string): Promise<any> {
    return this.usersRepository.delete(id);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {    
    const salt = await bcrypt.genSalt();
    const password = createUserDto.password;
    const hash_password  = await bcrypt.hash(password, salt);
    createUserDto.password = hash_password;
    
    return this.usersRepository.save(createUserDto).catch((e) => {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          {message: 'Account with this email already exists.', code: e.code},
        );
      }
      return e;
    });
  }

  async updateUser(uuid: string, updateUserDto: UpdateUserDto): Promise<any> {
    console.log({where: { uuid }});
    const userInfo = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('uuid = :uuid', { uuid })
      .execute();

    return userInfo;
  }
  
  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async remove(uuid: string) {
    const deletedResponse = await this.usersRepository.softDelete(uuid)
    
    return deletedResponse;
  }
}

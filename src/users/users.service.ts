import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from "bcrypt";
import { Role } from 'src/auth/auth.interfaces';
import { HttpResponse, HttpStatusResponse } from 'src/common/interfaces/http-responses.interface';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> { 

    if(createUserDto.role === Role.ADMIN) {
      createUserDto.password = await this.hashPassword(createUserDto.password);
    }
    
    return this.usersRepository.save(createUserDto).catch((e) => {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          {message: 'Account with this email already exists.', code: e.code},
        );
      }
      throw e;
    });
  }

  async updateUser(uuid: string, updateUserDto: UpdateUserDto): Promise<HttpResponse> {
    const response = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('uuid =:uuid', { uuid })
      .execute();

      return this.parseAffeceRowToHttpResponse(response.affected);
  }

  async updatePassword(uuid: string, updatePasswordUserDto: UpdatePasswordUserDto): Promise<HttpResponse> {
    updatePasswordUserDto.password = await this.hashPassword(updatePasswordUserDto.password);

    console.log(updatePasswordUserDto);
    

    const response = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(updatePasswordUserDto)
      .where('uuid = :uuid', { uuid })
      .execute();

      return this.parseAffeceRowToHttpResponse(response.affected);
  }
  
  findAll() {
    return this.usersRepository.find();
  }

  findOne(uuid: string) {
    return this.usersRepository.findOne({
      where: {uuid}
    });
  }

  async remove(uuid: string) {
    const response = await this.usersRepository.softDelete(uuid);

    return this.parseAffeceRowToHttpResponse(response.affected);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private parseAffeceRowToHttpResponse(affected: number) {
    return affected === 1 ? {
      status: HttpStatusResponse.SUCCESS
    }: {
      status: HttpStatusResponse.FAIL
    } ;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseAffeceRowToHttpResponse } from 'src/utilities/helpers';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return this.roleRepository.save(createRoleDto);
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: string) {
    return this.roleRepository.findOne({
      where: {id}
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const response = await this.roleRepository
    .createQueryBuilder()
    .update(Role)
    .set(updateRoleDto)
    .where('id = :id', {id})
    .execute();

    return parseAffeceRowToHttpResponse(response.affected);
  }

  async remove(id: number) {
    const response = await this.roleRepository.softDelete(id);

    return parseAffeceRowToHttpResponse(response.affected);
  }
}

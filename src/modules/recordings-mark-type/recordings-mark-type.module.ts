import { Module } from '@nestjs/common';
import { RecordingsMarkTypeService } from './recordings-mark-type.service';
import { RecordingsMarkTypeController } from './recordings-mark-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordingsMarkType } from './entities/recordings-mark-type.entity'
import { RoleGuard } from '../auth/guard/role.guard';
import { AuthJWTGuard } from '../auth/guard/auth.guard';
import { ApiKeyGuard } from '../auth/guard/apikey.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecordingsMarkType]),
    AuthModule
  ],
  controllers: [RecordingsMarkTypeController],
  providers: [RecordingsMarkTypeService, RoleGuard, AuthJWTGuard, ApiKeyGuard],
})
export class RecordingsMarkTypeModule {}

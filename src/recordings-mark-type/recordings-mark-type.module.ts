import { Module } from '@nestjs/common';
import { RecordingsMarkTypeService } from './recordings-mark-type.service';
import { RecordingsMarkTypeController } from './recordings-mark-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordingsMarkType } from './entities/recordings-mark-type.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([RecordingsMarkType]),
  ],
  controllers: [RecordingsMarkTypeController],
  providers: [RecordingsMarkTypeService]
})
export class RecordingsMarkTypeModule {}

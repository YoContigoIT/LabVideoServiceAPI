import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoServiceDto } from './create-video-service.dto';

export class UpdateVideoServiceDto extends PartialType(CreateVideoServiceDto) {}

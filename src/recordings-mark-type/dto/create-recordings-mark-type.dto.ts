import { IsOptional, IsString } from "class-validator";

export class CreateRecordingsMarkTypeDto {
    @IsString()
    @IsOptional()
    type?: string;
    
    @IsString()
    typeTitle: string;
}

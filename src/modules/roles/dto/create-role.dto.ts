import { IsNotEmpty } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    description: string

    upperLimitPriority?: number
    
    @IsNotEmpty()
    lowerLimitPriority: number
}

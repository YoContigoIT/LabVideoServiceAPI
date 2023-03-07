import { Expose } from "class-transformer";
import { IsOptional } from "class-validator";
import { Role } from "src/modules/roles/entities/role.entity";

export class GetAgentsDto {
    @IsOptional()
    search?: string

    @IsOptional()
    pageIndex?: number

    @IsOptional()
    pageSize?: number

    @IsOptional()
    paginate?: boolean = true;

    @IsOptional()
    roleId: string
}
import { SetMetadata } from '@nestjs/common';

export const ApiKeyType = (...keyTypes: string[]) => SetMetadata('keyTypes', keyTypes);

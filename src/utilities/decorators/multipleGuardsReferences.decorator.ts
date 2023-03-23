import { SetMetadata } from '@nestjs/common';

export const multipleGuardsReferences = (...multipleGuardsReferences: string[]) => SetMetadata('multipleGuardsReferences', multipleGuardsReferences);

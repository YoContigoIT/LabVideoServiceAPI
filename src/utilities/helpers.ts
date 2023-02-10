import { HttpStatusResponse } from 'src/common/interfaces/http-responses.interface';
import { v4 as uuidv4 } from 'uuid';

export function parseAffeceRowToHttpResponse(affected: number) {
  return affected === 1
    ? {
        status: HttpStatusResponse.SUCCESS,
      }
    : {
        status: HttpStatusResponse.FAIL,
      };
}

export async function getUuidv4(): Promise<string> {
  return uuidv4();
}

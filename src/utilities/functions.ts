import { HttpStatusResponse } from 'src/common/interfaces/http-responses.interface';

export function parseAffeceRowToHttpResponse(affected: number) {
  return affected === 1
    ? {
        status: HttpStatusResponse.SUCCESS,
      }
    : {
        status: HttpStatusResponse.FAIL,
      };
}

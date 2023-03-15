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


export function paginatorResponse(data: [any[], number], page: number, limit: number) {
  const [result, total] = data;
  const lastPage = Math.ceil(total/limit);
  const nextPage = page+1 > lastPage ? null : page+1;
  const prevPage = page-1 < 1 ? null : page-1;
  return {
    statusCode: 'success',
    data: [...result],
    count: total,
    currentPage: page,
    nextPage: nextPage,
    prevPage: prevPage,
    lastPage: lastPage,
  }
}

export function shuffleArray(array: any[]) {
  let currentIndex = array.length, randomIndex;

  while(currentIndex != 0){
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

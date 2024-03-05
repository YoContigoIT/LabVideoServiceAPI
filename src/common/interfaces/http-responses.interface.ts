export interface HttpResponse {
  status: HttpStatusResponse;
  message?: string;
  [key: string]: any;
}

export enum HttpStatusResponse {
  SUCCESS = 'sucess',
  FAIL = 'fail',
}

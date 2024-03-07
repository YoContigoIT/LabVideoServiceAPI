export enum ErrorHandleWsException {
  NOT_FOUND_GUEST = 'NOT_FOUND_GUEST',
  GUEST_ALREADY_CONNECT = 'GUEST_ALREADY_CONNECT',
}

interface Errors {
  [error: string]: {
    message: string;
    errorCode?: number;
  };
}

export const errors: Errors = {
  NOT_FOUND_GUEST: {
    message: 'NOT_FOUND_GUEST',
    errorCode: 404,
  },
  GUEST_ALREADY_CONNECT: {
    message: 'GUEST_ALREADY_CONNECT',
    errorCode: 400,
  },
};

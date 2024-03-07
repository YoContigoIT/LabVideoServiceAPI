import { ErrorFactory } from './error.factory';
import { errors } from './error.handle';

export class ErrorConstructor extends ErrorFactory {
  constructor(error: string) {
    super(errors[error].message, errors[error].errorCode);
  }
}

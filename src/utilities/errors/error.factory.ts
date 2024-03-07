import { WsException } from '@nestjs/websockets';
import { ErrorHandleWsException } from './error.handle';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class ErrorFactory {
  private message: string;
  private status: number;

  constructor(message: string, status: number) {
    this.message = message;
    this.status = status;

    this.createErrorFactory();
  }

  private async createErrorFactory() {
    if (this.message === ErrorHandleWsException.NOT_FOUND_GUEST) {
      throw new WsException({ message: this.message, status: this.status });
    }

    return new Error(this.message);
  }
}

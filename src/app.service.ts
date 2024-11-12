import { Injectable } from '@nestjs/common';

// Modal [Service(Business Logic) -> Respository(Adapt) -> DataSource]
@Injectable() //Decorator
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URI), UsersModule, AuthModule], 
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}

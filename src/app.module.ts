import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotModule } from './chatbot/chatbot.module';
import { environment } from './commons/enviroments/enviroment';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    name: 'chatbot',
    host: environment.TYPEORM_HOST,
    port: environment.TYPEORM_PORT,
    username: environment.TYPEORM_USERNAME,
    password: environment.TYPEORM_PASSWORD,
    database: environment.TYPEORM_DATABASE,
    entities: [__dirname + environment.TYPEORM_ENTITIES],
    synchronize: environment.TYPEORM_SYNCHRONIZE,
  }), ChatbotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

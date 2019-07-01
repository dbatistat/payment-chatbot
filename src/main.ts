import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './commons/enviroments/enviroment';
import { Logger } from '@nestjs/common';
import bodyParser = require('body-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.json());
  await app.listen(process.env.PORT || environment.API_PORT);
}

bootstrap().catch(err => Logger.error(err));

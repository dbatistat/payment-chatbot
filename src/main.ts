import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './commons/enviroments/enviroment';
import bodyParser = require('body-parser');
import cors = require('cors');
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.json());
  app.use(cors({
    origin: environment.API_CORS || '*',
  }));
  await app.listen(process.env.PORT || environment.API_PORT);
}

bootstrap().catch(err => Logger.error(err));

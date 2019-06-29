import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentChatbotController } from './chatbot/payment-chatbot/payment-chatbot.controller';

@Module({
  imports: [],
  controllers: [AppController, PaymentChatbotController],
  providers: [AppService],
})
export class AppModule {}

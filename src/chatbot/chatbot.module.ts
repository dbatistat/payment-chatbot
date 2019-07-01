import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './payment/entities/payment.entity';
import { FacebookChatbotController } from './facebook-chatbot/facebook-chatbot.controller';
import { FacebookChatbotService } from './facebook-chatbot/facebook-chatbot.service';
import { TwilioSmsService } from './twilio/twilio-sms.service';
import { PaymentService } from './payment/payment.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([PaymentEntity], 'chatbot')
  ],
  controllers: [FacebookChatbotController],
  providers: [PaymentService, FacebookChatbotService, TwilioSmsService],
})
export class ChatbotModule {
}

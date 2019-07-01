import { HttpModule, Module } from '@nestjs/common';
import { FacebookChatbotController } from './facebook-chatbot/facebook-chatbot.controller';
import { FacebookChatbotService } from './facebook-chatbot/facebook-chatbot.service';
import { TwilioSmsService } from './twilio/twilio-sms.service';
import { PaymentService } from './payment/payment.service';

@Module({
  imports: [HttpModule],
  controllers: [FacebookChatbotController],
  providers: [FacebookChatbotService, TwilioSmsService, PaymentService],
})
export class ChatbotModule {}

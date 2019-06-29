import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';

@Controller('payment_chatbot')
export class PaymentChatbotController {
  @Post()
  getHello(@Body() data: any): string {
    return 'EVENT_RECEIVED';
  }
}

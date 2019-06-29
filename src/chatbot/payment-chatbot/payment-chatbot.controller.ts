import { Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';

@Controller('payment_chatbot')
export class PaymentChatbotController {
  @Post()
  getHello(@Body() data: any, @Res() response) {
    response.status(HttpStatus.OK).json('EVENT_RECEIVED');
  }
}

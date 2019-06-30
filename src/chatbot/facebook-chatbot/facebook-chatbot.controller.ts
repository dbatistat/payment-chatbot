import { Controller, Get, HttpStatus, Logger, Post, Query, Res } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { FacebookMessageDto } from './dto/FacebookMessage.dto';
import { FacebookChatbotService } from './facebook-chatbot.service';

@Controller('facebook_chatbot')
export class FacebookChatbotController {

  constructor(private service: FacebookChatbotService) {
  }

  @Post()
  async webhook(@Body() data: FacebookMessageDto, @Res() response) {
    this.service.webhook(data).then(res => {
      response.status(HttpStatus.OK).send('EVENT_RECEIVED');
    }).catch(error => {
      response.sendStatus(HttpStatus.NOT_FOUND);
    });
  }

  @Get()
  async webhookVerification(@Query('hub.mode') mode: string,
                            @Query('hub.verify_token') token: string,
                            @Query('hub.challenge') challenge: string,
                            @Res() response) {
    this.service.webhookVerification(mode, token, challenge).then(res => {
      Logger.log('WEBHOOK_VERIFIED');
      response.status(HttpStatus.OK).send(challenge);
    }).catch(error => {
      response.sendStatus(HttpStatus.FORBIDDEN);
    });
  }
}

import { Controller, Get, Post, Query, Res, Logger, HttpStatus } from '@nestjs/common';
import { TOKEN } from '../../commons/constants/constants';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { FacebookMessageDto } from './dto/FacebookMessage.dto';

@Controller('facebook_chatbot')
export class FacebookChatbotController {

  @Post()
  webhook(@Body() data: FacebookMessageDto, @Res() response) {
    if (data.object === 'page') {
      data.entry.forEach(entry => {
        const webhookEvent = entry.messaging[0];
        Logger.log(webhookEvent);
      });

      response.status(HttpStatus.OK).send('EVENT_RECEIVED');
    } else {
      response.sendStatus(HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  webhookVerification(@Query('hub.mode') mode: string,
                      @Query('hub.verify_token') token: string,
                      @Query('hub.challenge') challenge: string,
                      @Res() response) {
    if (mode && token) {
      if (mode === 'subscribe' && token === TOKEN.APPLICATION) {
        Logger.log('WEBHOOK_VERIFIED');
        response.status(HttpStatus.OK).send(challenge);
      } else {
        response.sendStatus(HttpStatus.FORBIDDEN);
      }
    }
    response.sendStatus(HttpStatus.FORBIDDEN);
  }
}

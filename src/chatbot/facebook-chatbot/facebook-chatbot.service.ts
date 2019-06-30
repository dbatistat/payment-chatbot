import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FacebookMessageDto } from './dto/FacebookMessage.dto';
import { TOKEN } from '../../commons/constants/constants';

@Injectable()
export class FacebookChatbotService {
  async webhook(data: FacebookMessageDto) {
    Logger.log(data, 'WEBHOOK DATA');
    if (data.object === 'page') {
      data.entry.forEach(entry => {
        const webhookEvent = entry.messaging[0];
        Logger.log(webhookEvent, 'WEBHOOK');
      });
      return true;
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  async webhookVerification(mode: string,
                            token: string,
                            challenge: string) {
    if (!mode || !token) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    if (mode !== 'subscribe' && token !== TOKEN.APPLICATION) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    Logger.log('WEBHOOK_VERIFIED', 'VERIFICATION');
    Logger.log('MODE: ' + mode, 'VERIFICATION');
    Logger.log('TOKEN: ' + token, 'VERIFICATION');
    Logger.log('CHALLENGE: ' + challenge, 'VERIFICATION');
    return true;
  }
}

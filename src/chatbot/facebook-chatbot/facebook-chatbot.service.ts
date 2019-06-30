import { HttpException, HttpService, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FacebookMessageDto } from './dto/FacebookMessage.dto';
import { API_URL, TOKEN } from '../../commons/constants/constants';
import { MESSAGE } from './messages';

@Injectable()
export class FacebookChatbotService {

  constructor(private readonly httpService: HttpService) {
  }

  async webhook(data: FacebookMessageDto) {
    if (data.object !== 'page') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    data.entry.forEach(entry => {
      const webhookEvent = entry.messaging[0];

      const senderId = webhookEvent.sender.id;
      Logger.log('Sender PSID: ' + senderId);
      if (webhookEvent.message) {
        Logger.log(webhookEvent.message, 'Sender Message');
        return this.handleMessage(senderId, webhookEvent.message);
      } else if (webhookEvent.postback) {
        Logger.log(webhookEvent.postback, 'Sender POSTBACK');
        this.handlePostback(senderId, webhookEvent.postback);
      }
    });
    return true;
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

  async handleMessage(senderId, receivedMessage) {
    let response;

    if (receivedMessage.text) {
      response = {
        text: `Enviaste: '${receivedMessage.text}'. Now send me an attachment!`,
      };
    } else {
      response = {
        text: `No entiendo que has dicho.`,
      };
    }

    return this.sendApi(senderId, response);
  }

  async handlePostback(senderId, postBack) {
    let response;

    const payload = postBack.payload;

    if (payload === 'START') {
      response = MESSAGE.START;
    } else if (payload === 'yes') {
      response = MESSAGE.GET_PHONE;
    } else if (payload === 'no') {
      response = MESSAGE.NO_START;
    }

    return this.sendApi(senderId, response);
  }

  async sendApi(senderId: any, response: any) {
    const requestBody = {
      recipient: {
        id: senderId,
      },
      message: response,
    };

    Logger.log(requestBody, 'REQUEST_BODY');
    Logger.log(API_URL.FACEBOOK + 'messages?access_token=' + TOKEN.FACEBOOK.trim(), 'REQUEST_URL');

    this.httpService.post(API_URL.FACEBOOK + 'messages?access_token=' + TOKEN.FACEBOOK.trim(), requestBody,
      {
        headers: [{ 'content-type': 'application/json' }, { 'Cache-Control': 'no-cache' }],
      }).subscribe(res => {
      Logger.log(res, 'API_FACEBOOK_OK');
    }, error => {
      Logger.log(error, 'API_FACEBOOK_ERROR');
    });
  }

}

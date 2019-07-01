import { HttpException, HttpService, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FacebookMessageDto } from './dto/FacebookMessage.dto';
import { API_URL, TOKEN } from '../../commons/constants/constants';
import { MESSAGE } from './messages';
import { AxiosResponse } from 'axios';
import { TwilioSmsService } from '../twilio/twilio-sms.service';

@Injectable()
export class FacebookChatbotService {

  constructor(private readonly httpService: HttpService,
              private readonly twilioService: TwilioSmsService) {
  }

  async webhook(data: FacebookMessageDto) {
    if (data.object !== 'page') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    Logger.log(data, 'DATA_APPLICATION');

    data.entry.forEach(entry => {
      const webhookEvent = entry.messaging[0];

      const senderId = webhookEvent.sender.id;
      Logger.log('Sender PSID: ' + senderId);
      Logger.log(webhookEvent, 'Event Sender Message');
      if (webhookEvent.message) {
        Logger.log(webhookEvent.message, 'Sender Message');
        this.handleMessage(senderId, webhookEvent.message);
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
    const response = await this.getMessage(receivedMessage);

    await this.sendApi(senderId, response);
  }

  private async getMessage(receivedMessage) {
    if (!receivedMessage.text) {
      return {
        text: `No entiendo lo que intentas decirme`,
      };
    }

    if (this.twilioService.validE164(receivedMessage.text)) {
      await this.twilioService.sendMessage(receivedMessage.text);
      return {
        text: `Enviaste un SMS a: '${receivedMessage.text}'.`,
      };
    }

    return {
      text: `Enviaste: '${receivedMessage.text}'. Now send me an attachment!`,
    };
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

    await this.sendApi(senderId, response);
  }

  sendApi(senderId: any, response: any): Promise<AxiosResponse> {
    const requestBody = {
      recipient: {
        id: senderId,
      },
      message: response,
    };

    Logger.log(requestBody, 'REQUEST_BODY');
    Logger.log(API_URL.FACEBOOK + 'messages?access_token=' + TOKEN.FACEBOOK.trim(), 'REQUEST_URL');

    return this.httpService.post(API_URL.FACEBOOK + 'messages?access_token=' + TOKEN.FACEBOOK.trim(), requestBody,
      {
        headers: [{ 'content-type': 'application/json' }, { 'Cache-Control': 'no-cache' }],
      }).toPromise();
  }

}

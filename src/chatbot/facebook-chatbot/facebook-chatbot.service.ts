import { HttpException, HttpService, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FacebookMessageDto } from './dto/FacebookMessage.dto';
import { TOKEN } from '../../commons/constants/constants';

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

      const senderPsid = webhookEvent.sender.id;
      Logger.log('Sender PSID: ' + senderPsid);
      Logger.log(webhookEvent.message, 'Sender Message');
      if (webhookEvent.message) {
        this.handleMessage(senderPsid, webhookEvent.message);
      } else if (webhookEvent.postback) {
        Logger.log(webhookEvent.postback, 'Sender POSTBACK');
        // this.handlePostback(senderPsid, webhookEvent.postback);
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

  async handleMessage(senderPsid, receivedMessage) {
    let response;

    if (receivedMessage.text) {
      response = {
        text: `You sent the message: '${receivedMessage.text}'. Now send me an attachment!`,
      };
    } else if (receivedMessage.attachments) {

      const attachmentUrl = receivedMessage.attachments[0].payload.url;
      response = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: 'Is this the right picture?',
              subtitle: 'Tap a button to answer.',
              image_url: attachmentUrl,
              buttons: [
                {
                  type: 'postback',
                  title: 'Yes!',
                  payload: 'yes',
                },
                {
                  type: 'postback',
                  title: 'No!',
                  payload: 'no',
                },
              ],
            }],
          },
        },
      };
    }

    this.sendApi(senderPsid, response).then(res => {
      Logger.log(res, 'API_FACEBOOK_OK');
    }).catch(error => {
      Logger.log(error, 'API_FACEBOOK_ERROR');
    });
  }

  async handlePostback(senderPsid, receivedPostback) {
    let response;

    const payload = receivedPostback.payload;

    if (payload === 'yes') {
      response = { text: 'Thanks!' };
    } else if (payload === 'no') {
      response = { text: 'Oops, try sending another image.' };
    }

    this.sendApi(senderPsid, response).then(res => {
      Logger.log(res, 'API_FACEBOOK_OK');
    }).catch(error => {
      Logger.log(error, 'API_FACEBOOK_ERROR');
    });
  }

  async sendApi(senderPsid: any, response: any) {
    const requestBody = {
      recipient: {
        id: senderPsid,
      },
      message: response,
    };

    Logger.log(requestBody, 'REQUEST_BODY');

    return this.httpService.post('https://graph.facebook.com/v3.3/me/messages',
      requestBody, {
        headers: { access_token: TOKEN.FACEBOOK },
      });
  }
}

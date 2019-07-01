import { HttpException, HttpService, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FacebookMessageDto } from './dto/FacebookMessage.dto';
import { API_URL, TOKEN } from '../../commons/constants/constants';
import { MESSAGE } from './messages';
import { AxiosResponse } from 'axios';
import { TwilioSmsService } from '../twilio/twilio-sms.service';
import { PaymentService } from '../payment/payment.service';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { PaymentStep } from '../payment/payment-step';

const START = 'EMPEZAR';

@Injectable()
export class FacebookChatbotService {

  constructor(private readonly httpService: HttpService,
              private readonly twilioService: TwilioSmsService,
              private readonly paymentService: PaymentService) {
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
        return this.handleMessage(senderId, webhookEvent.message).catch(error => Logger.error(error));
      } else if (webhookEvent.postback) {
        Logger.log(webhookEvent.postback, 'Sender POSTBACK');
        return this.handlePostback(senderId, webhookEvent.postback).catch(error => Logger.error(error));
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

  private async handleMessage(senderId, receivedMessage) {
    const response = await this.getMessage(senderId, receivedMessage);

    return this.sendApi(senderId, response);
  }

  private async handlePostback(senderId, postBack) {
    let response;

    const payload = postBack.payload;

    if (payload === 'START') {
      const payment = await this.paymentService.existAValidPayment({ facebookId: senderId });
      if (payment) {
        response = await this.getPaymentMessage(payment).catch(error => Logger.error(error));
      } else {
        response = MESSAGE.START;
        await this.paymentService.registerNew({ facebookId: senderId, date: new Date() });
      }
    } else if (payload === 'yes') {
      response = MESSAGE.START;
      await this.paymentService.registerStart({ facebookId: senderId });
    } else if (payload === 'no') {
      response = MESSAGE.NO_START;
    }

    return this.sendApi(senderId, response);
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

  private async getMessage(senderId, receivedMessage) {
    if (!receivedMessage.text) {
      return {
        text: `No entiendo lo que intentas decirme`,
      };
    }

    const value = receivedMessage.text;

    if (receivedMessage.text.toUpperCase() === START) {
      return MESSAGE.START;
    }

    const payment = await this.paymentService.existAValidPayment({ facebookId: senderId });

    if (payment.paymentStep === PaymentStep.NUMBER) {
      if (this.twilioService.validE164(value)) {
        await this.paymentService.registerNumber({ facebookId: senderId, number: value });
        return MESSAGE.GET_AMOUNT;
      } else {
        return {
          text: 'Por favor, escribe un número de celular correcto.',
        };
      }
    }

    if (payment.paymentStep === PaymentStep.AMOUNT) {
      if (Number(value)) {
        await this.paymentService.registerAmount({ facebookId: senderId, amount: Number(value) });
        await this.twilioService.sendMessage(payment.paymentPhoneNumber, 'Se ha transferido ' + value + ' a su cuenta.');
        return MESSAGE.PAYMENT_SUCCESSFUL;
      } else {
        return {
          text: 'Por favor, escribe un monto correcto.',
        };
      }
    }

    return MESSAGE.NO_START;
  }

  private async getPaymentMessage(payment: PaymentEntity) {
    if (payment.paymentStep === PaymentStep.STARTED) {
      this.paymentService.registerStart({ facebookId: payment.facebookId }).catch(error => Logger.error(error));
      return MESSAGE.GET_PHONE;
    }

    if (payment.paymentStep === PaymentStep.NUMBER) {
      return MESSAGE.GET_AMOUNT;
    }

    if (payment.paymentStep === PaymentStep.AMOUNT) {
      return MESSAGE.NO_START;
    }
  }
}

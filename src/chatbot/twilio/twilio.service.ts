import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import Twilio = require('twilio/lib/rest/Twilio');
import { TWILIO } from '../../commons/constants/constants';

@Injectable()
export class TwilioService {

  async sendMessage(phoneNumber: string) {
    const client = new Twilio(TWILIO.ACCOUNT_ID, TWILIO.AUTH_TOKEN);

    const phoneNumbers = ['phone-number-1', 'phone-number-2'];

    Logger.log(phoneNumber, 'TWILIO');

    if (!this.validE164(phoneNumber)) {
      throw new HttpException('number must be E164 format!', HttpStatus.FORBIDDEN);
    }

    const textContent = {
      body: `You have a new sms from Dale Nguyen :)`,
      to: phoneNumber,
      from: TWILIO.NUMBER,
    };

    client.messages.create(textContent)
      .then((message) => Logger.log(message.to));

    return true;
  }

  validE164(num): boolean {
    return /^\+?[1-9]\d{1,14}$/.test(num);
  }
}

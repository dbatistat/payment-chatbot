import { Injectable } from '@nestjs/common';
import { PaymentRegisterNewDto } from './dto/payment-register-new.dto';
import { PaymentRegisterNumberDto } from './dto/payment-register-number.dto';
import { PaymentRegisterAmountDto } from './dto/payment-register-amount.dto';
import { PaymentSearchDto } from './dto/payment-search.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentStep } from './payment-step';
import { PaymentEntity } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(@InjectRepository(PaymentEntity)
              private readonly paymentRepository: Repository<PaymentEntity>,
  ) {
  }

  async existAValidPayment(paymentDto: PaymentSearchDto) {
    const payment = await this.paymentRepository.findOne({ where: { facebookId: paymentDto.facebookId } });
    return payment ? payment.paymentStep === PaymentStep.SUCCESSFUL ? null : payment : null;
  }

  async registerNew(registerNewDto: PaymentRegisterNewDto) {
    return this.paymentRepository.save({
      facebookId: registerNewDto.facebookId,
      paymentStep: PaymentStep.STARTED,
      registerAt: registerNewDto.date,
    });
  }

  async registerStart(paymentDto: PaymentSearchDto) {
    const payment = await this.paymentRepository.findOne({ where: { facebookId: paymentDto.facebookId } });
    payment.paymentStep = PaymentStep.NUMBER;
    return this.paymentRepository.save(payment);
  }

  async registerNumber(registerNumberDto: PaymentRegisterNumberDto) {
    const payment = await this.paymentRepository.findOne({ where: { facebookId: registerNumberDto.facebookId } });
    payment.paymentPhoneNumber = registerNumberDto.number;
    payment.paymentStep = PaymentStep.AMOUNT;
    return this.paymentRepository.save(payment);
  }

  async registerAmount(registerNumberDto: PaymentRegisterAmountDto) {
    // const payment = await this.paymentRepository.findOne({ where: { facebookId: registerNumberDto.facebookId } });
    // payment.amount = registerNumberDto.amount;
    // payment.paymentStep = PaymentStep.SUCCESSFUL;
    // return this.paymentRepository.save(payment);
  }
}

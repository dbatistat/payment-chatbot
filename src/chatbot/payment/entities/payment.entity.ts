import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentStep } from '../payment-step';

@Entity({name: 'payment'})
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'facebook_id', nullable: false })
  facebookId: string;

  @Column({ name: 'payment_phone_number', nullable: true })
  paymentPhoneNumber: string;

  @Column({ name: 'amount', nullable: true })
  amount: number;

  @Column({ name: 'payment_step', type: 'integer', nullable: false })
  paymentStep: PaymentStep;

  @Column({name: 'register_at', type: 'datetime'})
  registerAt: Date;
}

import { Payment } from '@/databases/models';
import { PaymentCreateDto } from '@/dto/payment/payment-create.dto';
import { PaymentUpdateDto } from '@/dto/payment/payment-update.dto';
import { Request } from 'express';

export interface IPaymentService {
  getAll(userId: string): Promise<Payment[]>;
  create(payload: PaymentCreateDto): Promise<Payment>;
  update(id: number, payload: PaymentUpdateDto): Promise<void>;
  createPaymentUrl(req: Request): string;
}

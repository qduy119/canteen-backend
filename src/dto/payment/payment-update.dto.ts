import { Payment } from '@/databases/models';

export type PaymentUpdateDto = Partial<Omit<Payment, 'id'>>;

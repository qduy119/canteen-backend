import { Payment } from '@/databases/models';

export type PaymentCreateDto = Partial<Omit<Payment, 'id'>>;

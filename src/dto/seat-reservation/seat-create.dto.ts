import { SeatReservation } from '@/databases/models';

export type SeatCreateDto = Partial<Omit<SeatReservation, 'id'>>;

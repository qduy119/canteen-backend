import { SeatReservation } from '@/databases/models';
import { SeatCreateDto } from '@/dto/seat-reservation/seat-create.dto';
import { SeatDeleteDto } from '@/dto/seat-reservation/seat-delete.dto';

export interface ISeatReservationService {
  getAll(): Promise<SeatReservation[]>;
  create(payload: SeatCreateDto): Promise<void>;
  delete(payload: SeatDeleteDto): Promise<void>;
}

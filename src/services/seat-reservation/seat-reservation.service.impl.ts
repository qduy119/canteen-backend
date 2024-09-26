import { SeatCreateDto } from '@/dto/seat-reservation/seat-create.dto';
import { SeatDeleteDto } from '@/dto/seat-reservation/seat-delete.dto';
import { ISeatReservationService } from './seat-reservation.service';
import { SeatReservation } from '@/databases/models';
import { injectable } from 'inversify';

@injectable()
export default class SeatReservationServiceImpl
  implements ISeatReservationService
{
  async getAll(): Promise<SeatReservation[]> {
    const data = await SeatReservation.findAll();
    return data;
  }
  async create(payload: SeatCreateDto): Promise<void> {
    await SeatReservation.create(payload);
  }
  async delete(payload: SeatDeleteDto): Promise<void> {
    await SeatReservation.destroy({ where: { ...payload } });
  }
}

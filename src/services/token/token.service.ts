import { Token } from '@/databases/models';
import { TokenDto } from '@/dto/token/token.dto';

export interface ITokenService {
  find(payload: TokenDto): Promise<Token>;
  destroy(payload: TokenDto): Promise<void>;
}

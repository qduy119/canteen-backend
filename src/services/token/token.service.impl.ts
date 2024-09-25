import { Token } from '@/databases/models';
import { TokenDto } from '@/dto/token/token.dto';
import { ITokenService } from './token.service';
import { injectable } from 'inversify';

@injectable()
export default class TokenServiceImpl implements ITokenService {
  async find(payload: TokenDto): Promise<Token> {
    const found = await Token.findOne({
      where: {
        userId: payload.userId,
        token: payload.token
      }
    });
    return found;
  }
  async destroy(payload: TokenDto): Promise<void> {
    await Token.destroy({
      where: {
        userId: payload.userId,
        token: payload.token
      }
    });
  }
}

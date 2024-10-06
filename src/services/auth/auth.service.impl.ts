import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { promisify } from 'util';
import { Token, User } from '@/databases/models';
import { CustomError } from '@/utils/error';
import { IAuthService } from './auth.service';
import { LoginReqDto } from '@/dto/user/login-req.dto';
import { LoginResDto } from '@/dto/user/login-res.dto';
import { RegisterDto } from '@/dto/user/register.dto';
import {
  genAccessToken,
  genRefreshToken,
  getRefreshTokenExpiration,
  JwtPayload,
  sendAccessToken,
  sendRefreshToken
} from '@/utils/token';
import { RefreshTokenResDto } from '@/dto/user/refresh-token-res.dto';
import { ITokenService } from '../token/token.service';
import { TYPES } from '@/container/types';
import envConfig from '@/config';

const verifyAsync = promisify(jwt.verify.bind(jwt));

@injectable()
export default class AuthServiceImpl implements IAuthService {
  constructor(
    @inject(TYPES.TokenService) private readonly tokenService: ITokenService
  ) {}

  async authenticate(payload: LoginReqDto): Promise<LoginResDto> {
    const { email, password } = payload;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new CustomError(404, 'User not found');
    }
    if (!(await user.correctPassword(password))) {
      throw new CustomError(409, 'Email or password is incorrect');
    }
    delete user.password;
    const [accessToken, refreshToken] = [
      genAccessToken(user),
      genRefreshToken(user)
    ];
    const expirationDate = new Date(Date.now() + getRefreshTokenExpiration());
    await Token.create({
      userId: user.id,
      token: refreshToken,
      expirationDate
    });
    return {
      accessToken,
      refreshToken
    };
  }
  async register(payload: RegisterDto): Promise<void> {
    const id = uuid();
    const user = await User.findOne({
      where: { email: payload.email }
    });
    if (user) {
      throw new CustomError(409, 'User already exists');
    }
    await User.create({ ...payload, id });
  }
  async logout(refreshToken: string): Promise<void> {
    const payload: JwtPayload = await verifyAsync(
      refreshToken,
      envConfig.REFRESH_TOKEN_SECRET
    );
    await this.tokenService.destroy({
      userId: payload.id,
      token: refreshToken
    });
  }
  async refresh(refreshToken: string): Promise<RefreshTokenResDto> {
    const payload: JwtPayload = await verifyAsync(
      refreshToken,
      envConfig.REFRESH_TOKEN_SECRET
    );
    const found = await Token.findOne({
      where: {
        userId: payload.id,
        token: refreshToken
      }
    });
    if (!found) {
      throw new CustomError(400, 'Refresh token is not found');
    }
    const accessToken = genAccessToken(payload);
    return { accessToken };
  }
  async handleThirdPartyAuthentication(
    error: any,
    user: any,
    info: any,
    res: Response
  ): Promise<void> {
    if (error) {
      throw error;
    }
    if (!user) {
      const { message } = info;
      throw new CustomError(401, message);
    }
    delete user.get().password;
    sendAccessToken(user, res);
    await sendRefreshToken(user, res);

    res.redirect(`${envConfig.CLIENT_URL}`);
  }
}

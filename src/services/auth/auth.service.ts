import { LoginReqDto } from '@/dto/user/login-req.dto';
import { LoginResDto } from '@/dto/user/login-res.dto';
import { RefreshTokenResDto } from '@/dto/user/refresh-token-res.dto';
import { RegisterDto } from '@/dto/user/register.dto';
import { Response } from 'express';

export interface IAuthService {
  authenticate(payload: LoginReqDto): Promise<LoginResDto>;
  register(payload: RegisterDto): Promise<void>;
  logout(refreshToken: string): Promise<void>;
  refresh(refreshToken: string): Promise<RefreshTokenResDto>;
  handleThirdPartyAuthentication(error: any, user: any, info: any, res: Response): Promise<void>;
}

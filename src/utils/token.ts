import jwt from 'jsonwebtoken';
import { CookieOptions, Response } from 'express';
import { Token } from '@/databases/models';

export type JwtPayload = {
  id: string;
  role: string;
};

export const genAccessToken = (payload: JwtPayload) =>
  jwt.sign(
    { id: payload.id, role: payload.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
    }
  );

export const genRefreshToken = (payload: JwtPayload) =>
  jwt.sign(
    { id: payload.id, role: payload.role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION
    }
  );

export async function sendRefreshToken(payload: JwtPayload, res: Response) {
  const refreshToken = genRefreshToken(payload);
  const expirationDate = new Date(
    Date.now() +
      Number(process.env.TOKEN_COOKIE_EXPIRATION) * 24 * 60 * 60 * 1000
  );
  await Token.create({
    userId: payload.id,
    token: refreshToken,
    expirationDate
  });
  const options = {
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    secure: process.env.NODE_ENV === 'development' ? false : true,
    httpOnly: true,
    expires: expirationDate
  } as CookieOptions;
  res.cookie('refreshToken', refreshToken, options);
}

export function sendAccessToken(payload: JwtPayload, res: Response) {
  const accessToken = genAccessToken(payload);
  const expirationDate = new Date(
    Date.now() +
      Number(process.env.TOKEN_COOKIE_EXPIRATION) * 24 * 60 * 60 * 1000
  );
  const options = {
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    secure: process.env.NODE_ENV === 'development' ? false : true,
    httpOnly: true,
    expires: expirationDate
  } as CookieOptions;
  res.cookie('accessToken', accessToken, options);
  res.cookie('role', payload.role, options);
}

export function getRefreshTokenExpiration() {
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRATION;
  const type = expiresIn.charAt(expiresIn.length - 1);

  let period = +expiresIn.slice(0, expiresIn.length - 1);
  period =
    (type === 's'
      ? period
      : type === 'm'
        ? period * 60
        : type === 'h'
          ? period * 60 * 60
          : period * 24 * 60 * 60) * 1000;

  return period;
}

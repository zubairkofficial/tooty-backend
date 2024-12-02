import { sign } from 'jsonwebtoken';

export const SignAccessToken = (payload: { sub: number; email: string }) => {
  const token = sign(payload, `${process.env.JWT_SECRET_KEY}`, {
    expiresIn: '1h',
  });
  return token;
};

export const SignRefreshToken = (payload: { sub: number; email: string }) => {
  return sign(payload, `${process.env.JWT_SECRET_KEY}`, { expiresIn: '14d' });
};

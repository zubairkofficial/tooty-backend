import { sign } from 'jsonwebtoken';

export const SignAccessToken = (payload: { sub: number; email: string, level: string, role: string }) => {
  const token = sign(payload, `${process.env.JWT_SECRET_KEY}`, {
    expiresIn: "1d",
  });
  return token;
};

export const SignRefreshToken = (payload: { sub: number; email: string, level: string, role: string }) => {
  return sign(payload, `${process.env.JWT_SECRET_KEY}`, { expiresIn: '14d' });
};

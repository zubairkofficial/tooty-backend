import { verify } from 'jsonwebtoken';

export const VerifyRefreshToken = (token: string): any => {
  const res: any = verify(token, process.env.JWT_SECRET_KEY, (err, user: any) => {
    if (err) {
      return { sub: null, email: '' };
    }
    
    return user
  });
  return res
};

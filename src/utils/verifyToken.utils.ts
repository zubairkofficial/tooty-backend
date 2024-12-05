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


export const VerifyAccessToken = (token: string): any => {
  const res: any = verify(token, process.env.JWT_SECRET_KEY, (err, user: any) => {
    if (err) {
      return { sub: null, email: '', role: "" };
    }

    return user
  });
  return res
};


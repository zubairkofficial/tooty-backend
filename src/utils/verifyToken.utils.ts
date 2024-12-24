import { verify } from 'jsonwebtoken';

export const VerifyRefreshToken = (token: string): any => {
  const res: any = verify(token, process.env.JWT_SECRET_KEY, (err, user: any) => {
    if (err) {


      if (err.name == "TokenExpiredError") {
        return err.name
      }

      return { sub: null, email: '', level_id: null, role: "" };
    }
    console.log("user in token", user)
    return user
  });
  return res
};


export const VerifyAccessToken = (token: string): any => {
  const res: any = verify(token, process.env.JWT_SECRET_KEY, (err, user: any) => {
    if (err) {
      if (err.name == "TokenExpiredError") {
        return err.name
      }

      return { sub: null, email: '', level_id: null, role: "" };
    }

    return user
  });
  return res
};


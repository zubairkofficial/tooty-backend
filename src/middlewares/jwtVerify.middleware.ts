import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { VerifyAccessToken } from 'src/utils/verifyToken.utils';

export class JwtMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const token: any = req.headers['token'];
        console.log(token)
        if (!token) {
            throw new UnauthorizedException('Authorization token not provided');
        }

        try {
            const decoded = VerifyAccessToken(token);

            if (!decoded.sub) {
                throw new Error("UnAuthorized")
            }
            console.log(decoded)
            req.body['user'] = decoded; // Attach decoded data to the request object
            console.log("req after save", req.body)
            next();
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}

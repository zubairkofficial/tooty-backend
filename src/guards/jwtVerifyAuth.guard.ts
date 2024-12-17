// src/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { VerifyAccessToken } from 'src/utils/verifyToken.utils';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        // private readonly logger = new Logger('JWT AUTH guARD')
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.token
        console.log("token in jwt auth guard", token)
        if (!token) {
            throw new UnauthorizedException({
                statusCode: 4003,
                message: 'Authorization token is missing',
                error: 'Unauthorized',
            });
        }


        console.log("token in jwt auth guard 2")
        const user = VerifyAccessToken(token);
        console.log("token in jwt auth guard 3", user)
        if (user == "TokenExpiredError") {
            console.log("toke is expired")
            throw new UnauthorizedException({
                statusCode: 4001,
                message: 'Authorization token is invalid',
                error: 'Unauthorized',
            });
        }
        if (user?.sub == null) {
            throw new UnauthorizedException({
                statusCode: 4002,
                message: 'Invalid token',
                error: 'Unauthorized',
            });
        }
        request.user = user; // Attach the user to the request
        console.log("request user in jwtauth guard ", request.user)
        return true;

        // try {

        // } catch (error) {

        // }
    }
}

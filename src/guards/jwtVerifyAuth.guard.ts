// src/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { VerifyAccessToken } from 'src/utils/verifyToken.utils';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.token

        if (!token) {
            throw new UnauthorizedException({
                statusCode: 4001,
                message: 'Authorization token is missing',
                error: 'Unauthorized',
            });
            return false;
        }
        try {
            const user = VerifyAccessToken(token);
            request.user = user; // Attach the user to the request
            console.log(request.user)
            return true;
        } catch (error) {
            throw new UnauthorizedException({
                statusCode: 4002,
                message: 'Invalid token',
                error: 'Unauthorized',
            });
            return false;
        }
    }
}

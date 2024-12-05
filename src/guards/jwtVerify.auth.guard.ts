// src/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
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
            return false;
        }


        try {
            const user = VerifyAccessToken(token);
            request.body.user = user; // Attach the user to the request
            return true;
        } catch (error) {
            return false;
        }
    }
}

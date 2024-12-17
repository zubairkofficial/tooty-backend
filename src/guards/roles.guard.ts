// src/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../utils/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles) {
      return true; // If no roles are defined, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming user is attached to request via a previous middleware or guard

    if (!user || !requiredRoles.some(role => user.role == role)) {
      console.log("roles guard denied", user)
      console.log("roles guard denied")
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }
}

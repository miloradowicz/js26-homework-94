import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserDocument } from 'src/schemas/user.schema';

export const PermitGuard = (...roles: string[]) => {
  @Injectable()
  class PermitGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context
        .switchToHttp()
        .getRequest<Request & { user: UserDocument }>();

      if (!request.user) {
        throw new UnauthorizedException();
      }

      if (!roles.includes(request.user.role)) {
        throw new ForbiddenException();
      }
      return true;
    }
  }

  return PermitGuard;
};

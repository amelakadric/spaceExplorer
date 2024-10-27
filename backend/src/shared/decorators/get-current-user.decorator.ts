import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserJwtPayload } from '../../auth/types/user-jwt-payload';

export const GetCurrentUser = createParamDecorator(
  (data: keyof (UserJwtPayload | undefined), context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) {
      return request.user;
    }
    return request.user[data];
  },
);

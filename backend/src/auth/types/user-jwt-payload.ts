import { RolesEnum } from '../../users/enums/roles.enum';

export class UserJwtPayload {
  id: string;
  role: RolesEnum;
  email: string;
  accessToken?: string;
}

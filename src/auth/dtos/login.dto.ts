import { IsEmail, IsEnum, IsString } from 'class-validator';
import { RolesEnum } from '../../../users/enums/roles.enum';

export class LogInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(RolesEnum)
  role: RolesEnum;
}

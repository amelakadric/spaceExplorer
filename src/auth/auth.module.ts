import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';

import * as dotenv from 'dotenv';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
dotenv.config();
@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: `${process.env.JWT_SECRET_KEY}`,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,

    LocalAuthGuard,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [LocalAuthGuard, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}

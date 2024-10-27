import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    return {
      secret: `${process.env.JWT_SECRET_KEY}`,
      signOptions: { expiresIn: '1d' },
      global: true,
    };
  },
};

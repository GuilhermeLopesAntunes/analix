import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issue: process.env.JWT_TOKEN_ISSUE,
    jwtTtl: Number(process.env.JWT_TTL ?? 3600),
    jwtRefreshTtl: Number(process.env.JWT_REFRESH_TTL ?? 86400),
  };
});

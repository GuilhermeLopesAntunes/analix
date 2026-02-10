import { RoutePolices } from '../enum/route-policies.enum';

export class TokenPayloadDto {
  sub: number;
  email: string;
  routePolicies: RoutePolices;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

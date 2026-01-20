import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_TOKEN_PAYLOAD_KEY, ROUTE_POLICY_KEY } from '../auth.constants';
import { RoutePolices } from '../enum/route-policies.enum';

@Injectable()
export class RoutePolicenGuard implements CanActivate {
  constructor( private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routePolicyRequired = this.reflector.get<RoutePolices | undefined>(
      ROUTE_POLICY_KEY,
      context.getHandler(),
    );
    if (!routePolicyRequired) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const tokenPayload = request[REQUEST_TOKEN_PAYLOAD_KEY];
    if(!tokenPayload) {
      throw new UnauthorizedException(
        `Rota requer permissão ${routePolicyRequired}. Usuário não logado`,
      );
    }
    const { user } = tokenPayload;
    if (!user.routePolicies.includes(routePolicyRequired)) {
      throw new UnauthorizedException('Usuário não tem permissão');
    }
    return true;
  }
}

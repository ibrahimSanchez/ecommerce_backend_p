import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.getAllAndOverride("userRole", [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();
    // console.log("❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌",user.role, role);

    if (!role) return true;

    return role === user.role;
  }
}

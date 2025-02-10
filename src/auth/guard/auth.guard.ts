import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PUBLIC_KEY } from "src/constants/key-decorators";
import { Request } from "express";
import { useToken } from "src/utils/use.token";
import { IUseToken } from "../jwt-payload.interface";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();
    
    const token = req.headers["authorization"];
    
    // console.log("❌❌❌❌❌❌❌❌❌❌❌❌❌", token);

    if (!token || Array.isArray(token))
      throw new UnauthorizedException("Invalid token");

    const manageToken: IUseToken | string = useToken(token);

    if (typeof manageToken === "string")
      throw new UnauthorizedException(manageToken);

    if (manageToken.isExpired) throw new UnauthorizedException("Token expired");

    const { id } = manageToken;
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new UnauthorizedException("Invalid user");

    req.user = user;
    req.userRole = 'aaaa'


    return true;
  }
}

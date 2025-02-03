import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jet-payload.interface";
import { v4 } from "uuid";
import { ActivateUserDto } from "./dto/activate-user.dto";
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Todo:*************************************************************************
  async registerUser(createAuthDto: CreateAuthDto) {
    const { name, email, password } = createAuthDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      return await this.prismaService.user.create({
        data: { name, email, password: hashedPassword, activation_token: v4() },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(
            `El usuario con el email: ${createAuthDto.email} ya existe`,
          );
        }
      }
    }
  }

  // Todo:*************************************************************************
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const userFound = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userFound && (await bcrypt.compare(password, userFound.password))) {
      const payload: JwtPayload = {
        id: userFound.id,
        email,
        active: userFound.active,
      };

      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    }

    throw new UnauthorizedException(`Compruebe los credenciales`);
  }

  // Todo:*************************************************************************
  async findOneByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  // Todo:*************************************************************************
  async activateUser(activateUserDto: ActivateUserDto) {
    const { id, code } = activateUserDto;

    const user = await this.prismaService.user.findUnique({
      where: { id, activation_token: code, active: false },
    });

    if (!user) {
      throw new UnprocessableEntityException("No se puede realizar la accion");
    }
    await this.prismaService.user.update({
      where: { id },
      data: { active: true },
    });
  }

}

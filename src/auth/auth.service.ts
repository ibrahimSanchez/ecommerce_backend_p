import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { v4 } from "uuid";
import { ActivateUserDto } from "./dto/activate-user.dto";
import { RequestResetPasswordDto } from "./dto/request-reset-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Todo:*************************************************************************
  async hashedPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  // Todo:*************************************************************************
  async registerUser(createAuthDto: CreateAuthDto) {
    const { name, email, password } = createAuthDto;

    const newHashedPassword = await this.hashedPassword(password);

    try {
      return await this.prismaService.user.create({
        data: {
          name,
          email,
          password: newHashedPassword,
          activation_token: v4(),
        },
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
  async findOneByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user)
      throw new NotFoundException(
        `No se encuentra el usuario con email: ${email}`,
      );
    return user;
  }

  // Todo:*************************************************************************
  async findOneByResetPasswordToken(resetPasswordToken: string) {
    const user = await this.prismaService.user.findUnique({
      where: { reset_password_token: resetPasswordToken },
    });

    if (!user) throw new NotFoundException();
    return user;
  }

  // Todo:*************************************************************************
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const userFound = await this.findOneByEmail(email);

    if (await bcrypt.compare(password, userFound.password)) {
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

  // Todo:*************************************************************************
  async requestResetPassword(requestResetPasswordDto: RequestResetPasswordDto) {
    const { email } = requestResetPasswordDto;

    const user = await this.findOneByEmail(email);
    const { id } = user;

    await this.prismaService.user.update({
      where: { id },
      data: { reset_password_token: v4() },
    });

    // añadir la logica de mandar el email al usuario para que pueda cambiar la contraseña
    return "Implementar esa logica";
  }

  // Todo:*************************************************************************
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, resetPpasswordToken } = resetPasswordDto;

    const user = await this.findOneByResetPasswordToken(resetPpasswordToken);
    const { id } = user;

    const newHashedPassword = await this.hashedPassword(password);

    await this.prismaService.user.update({
      where: { id },
      data: { password: newHashedPassword, reset_password_token: null },
    });

    // añadir la logica de mandar el email al usuario para que pueda cambiar la contraseña
    return "Implementar esa logica";
  }

  // Todo:*************************************************************************
  async changePassword(changePasswordDto: ChangePasswordDto, user: User) {
    const { newPassword, oldPassword } = changePasswordDto;
    const { id } = user;

    if (await await bcrypt.compare(oldPassword, user.password)) {
      const newHashedPassword = await this.hashedPassword(newPassword);
      await this.prismaService.user.update({
        where: { id },
        data: { password: newHashedPassword, reset_password_token: null },
      });
    } else {
      throw new BadRequestException("La contraseña actual no coincide");
    }
  }
}

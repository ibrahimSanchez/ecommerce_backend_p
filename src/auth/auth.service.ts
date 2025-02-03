import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jet-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerUser(createAuthDto: CreateAuthDto) {
    const { name, email, password } = createAuthDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      return await this.prismaService.user.create({
        data: { name, email, password: hashedPassword },
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

  findAll() {
    return `This action returns all auth`;
  }

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

  async findOneByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

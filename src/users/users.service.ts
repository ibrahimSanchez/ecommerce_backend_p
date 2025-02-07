import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findMyAccount(user: User) {
    const { id } = user;

    try {
      const foundUser = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user)
        throw new NotFoundException(`No se encontró el usuario con id: ${id}`);

      return foundUser;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Ocurrió un error",
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async updateUserAccount(user: User, updateUserDto: UpdateUserDto) {
    const { id } = user;

    try {
      const foundUser = await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });

      if (!user)
        throw new NotFoundException(`No se encontró el usuario con id: ${id}`);

      return foundUser;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Ocurrió un error",
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}

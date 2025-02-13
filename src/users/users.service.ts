import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
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

  // Todo:*************************************************************************
  async findUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user)
      throw new NotFoundException(
        `No se encuentra el usuario con email: ${id}`,
      );
    return user;
  }

  // Todo:*************************************************************************
  async getAllUsers() {
    try {
      const allUsers = this.prismaService.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          phone: true,
          role: true,
        },
      });
      return allUsers;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  // Todo:*************************************************************************
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const foundUser = await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });

      if (!foundUser)
        throw new NotFoundException(`User with id: ${id} was not found`);

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

  // Todo:*************************************************************************
  async deleteUser(id: string) {
    try {
      const userFound = await this.prismaService.user.findUnique({
        where: { id },
      });
      if (!userFound) {
        throw new NotFoundException(`User with id: ${id} was not found`);
      }

      return await this.prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  // Todo:*************************************************************************
  async getAllRoles() {
    try {
      const allRoles = await this.prismaService.role.findMany();
      return allRoles;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

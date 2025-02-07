import { Controller, Get, Body, Patch, Param, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user-decorator";
import { User } from "@prisma/client";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/my-account")
  @UseGuards(AuthGuard("jwt"))
  findMyAccount(@GetUser() user: User) {
    return this.usersService.findMyAccount(user);
  }

  @Patch("/update-my-account")
  @UseGuards(AuthGuard("jwt"))
  updateUserAccount(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserAccount(user, updateUserDto);
  }
}

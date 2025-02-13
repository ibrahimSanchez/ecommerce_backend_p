import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
// import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user-decorator";
import { User } from "@prisma/client";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { RolesGuard } from "src/auth/guard/roles.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/my-account")
  @UseGuards(AuthGuard)
  findMyAccount(@GetUser() user: User) {
    return this.usersService.findMyAccount(user);
  }

  @Patch("/update-my-account")
  @UseGuards(AuthGuard)
  updateUserAccount(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserAccount(user, updateUserDto);
  }

  @Get("/get-all")
  @Roles("admin_role")
  @UseGuards(AuthGuard, RolesGuard)
  getAllUser(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.getAllUsers();
  }

  @Patch("/update-user/:id")
  @Roles("admin_role")
  @UseGuards(AuthGuard, RolesGuard)
  updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete("/delete-user/:id")
  @Roles("admin_role")
  @UseGuards(AuthGuard, RolesGuard)
  deleteUser(@Param("id") id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get("/get-roles")
  @Roles("admin_role")
  @UseGuards(AuthGuard, RolesGuard)
  getAllRoles() {
    return this.usersService.getAllRoles();
  }
}

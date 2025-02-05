import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { LoginDto } from "./dto/login.dto";
import { ActivateUserDto } from "./dto/activate-user.dto";
import { RequestResetPasswordDto } from "./dto/request-reset-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { GetUser } from "./get-user-decorator";
import { User } from "@prisma/client";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  registerUser(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.registerUser(createAuthDto);
  }

  @Post("/login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get("/activate-account")
  activateAccount(@Query() activateUserDto: ActivateUserDto) {
    return this.authService.activateUser(activateUserDto);
  }

  @Patch("/request-reset-password")
  requestResetPassword(@Body() requestResetPassword: RequestResetPasswordDto) {
    return this.authService.requestResetPassword(requestResetPassword);
  }

  @Patch("/reset-password")
  resetPassword(@Body() resetPassword: ResetPasswordDto) {
    return this.authService.resetPassword(resetPassword);
  }

  @Patch("/change-password")
  @UseGuards(AuthGuard())
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: User,
  ) {
    return this.authService.changePassword(changePasswordDto, user);
  }
}

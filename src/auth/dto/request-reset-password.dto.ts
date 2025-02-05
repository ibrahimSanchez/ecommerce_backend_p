import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RequestResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

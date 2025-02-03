import { IsNotEmpty, IsUUID } from "class-validator";

export class ActivateUserDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsUUID("4")
  code: string;
}

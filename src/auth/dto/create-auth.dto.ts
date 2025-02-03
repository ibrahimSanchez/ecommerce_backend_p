// import { User } from "@prisma/client";

// export type CreateAuthDto = Omit<User, "id | active | createdAt | updatedAt">;

import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

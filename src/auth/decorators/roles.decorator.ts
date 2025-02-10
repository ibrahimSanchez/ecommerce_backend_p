import { SetMetadata } from "@nestjs/common";

export const Roles = (role) => SetMetadata("userRole", role);

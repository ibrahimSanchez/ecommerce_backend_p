import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/get-user-decorator";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { RolesGuard } from "src/auth/guard/roles.guard";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get("/admin")
  @Roles("admin_role")
  @UseGuards(AuthGuard, RolesGuard)
  findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  @Get("/me")
  @UseGuards(AuthGuard)
  findAllOrdersByUserId(@GetUser() user: User) {
    return this.ordersService.findAllOrdersByUserId(user);
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.ordersService.findOne(+id);
  // }

  @Patch("/change-status/:id")
  @UseGuards(AuthGuard)
  update(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser() user: User,
  ) {
    return this.ordersService.updateStatus(id, updateOrderDto, user);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  remove(@Param("id") id: string, @GetUser() user: User) {
    return this.ordersService.remove(id, user);
  }
}

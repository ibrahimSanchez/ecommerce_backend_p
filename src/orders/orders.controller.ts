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
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/get-user-decorator";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"))
  findAll(@GetUser() user: User) {
    return this.ordersService.findAll(user);
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.ordersService.findOne(+id);
  // }

  @Patch("/change-status/:id")
  @UseGuards(AuthGuard("jwt"))
  update(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser() user: User,
  ) {
    return this.ordersService.updateStatus(id, updateOrderDto, user);
  }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.ordersService.remove(+id);
  // }
}

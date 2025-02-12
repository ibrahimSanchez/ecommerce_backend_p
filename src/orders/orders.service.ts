import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { Decimal } from "@prisma/client/runtime/library";

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const { arrayItems, total_amount, delivery_address } = createOrderDto;

    const arrItems = Array.isArray(arrayItems)
      ? arrayItems
      : arrayItems
        ? [arrayItems]
        : [];

    arrItems.forEach((item, index) => {
      if (!item.productId) {
        throw new Error(
          `Error: El producto en la posición ${index} no tiene productId definido.`,
        );
      }
    });

    try {
      const order = await this.prismaService.order.create({
        data: {
          delivery_address,
          userId: user.id,
          total_amount: new Decimal(total_amount),
          items: {
            create: arrItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: new Decimal(item.price),
            })),
          },
        },
        include: { items: true },
      });

      return order;
    } catch (error) {
      console.error("Error en createOrder:", error);
      throw error;
    }
  }

  async findAllOrdersByUserId(user: User) {
    const { id } = user;
    return await this.prismaService.order.findMany({
      where: {
        userId: id,
      },
    });
  }

  async findAllOrders() {
    try {
      return await this.prismaService.order.findMany();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar la orden. Contacte al administrador.`,
        error,
      );
    }
  }

  async updateStatus(id: string, updateOrderDto: UpdateOrderDto, user: User) {
    const { id: userId, role } = user;

    const q = role === "admin_role" ? { id } : { id, userId };
    const { status } = updateOrderDto;

    if (status !== "pending" && status !== "delivered" && status !== "canceled")
      throw new InternalServerErrorException(
        `La información introducida no es válida`,
      );
    try {
      const orderFound = await this.prismaService.order.update({
        where: q,
        data: updateOrderDto,
      });
      if (!orderFound)
        throw new NotFoundException(`La orden con id: ${id} no fue encontrada`);

      return orderFound;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar la orden. Contacte al administrador.`,
      );
    }
  }

  async remove(id: string, user: User) {
    const { id: userId, role } = user;
    const q = role === "admin_role" ? { id } : { id, userId };

    try {
      const orderFound = await this.prismaService.order.findUnique({
        where: q,
      });

      if (!orderFound) {
        throw new NotFoundException(`The order with ID: ${id} was not found.`);
      }

      return await this.prismaService.order.delete({
        where: q,
      });
    } catch (error) {
      // console.log('❌❌❌❌❌❌❌❌❌❌❌❌❌❌', error)
      throw new InternalServerErrorException(
        "Internal server error 000",
        error,
      );
    }
  }
}

//   findOne(id: number) {
//     return `This action returns a #${id} order`;
//   }

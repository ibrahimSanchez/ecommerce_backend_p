import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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

  async findAll(user: User) {
    const { id } = user;
    return await this.prismaService.order.findMany({
      where: {
        userId: id,
      },
    });
  }

  async updateStatus(id: string, updateOrderDto: UpdateOrderDto, user: User) {
    const { id: userId } = user;

    const { status } = updateOrderDto;

    if (status !== "pending" && status !== "delivered" && status !== "canceled")
      throw new InternalServerErrorException(
        `La información introducida no es válida`,
      );
    try {
      const orderFound = await this.prismaService.order.update({
        where: { id, userId },
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

  //   remove(id: number) {
  //     return `This action removes a #${id} order`;
  //   }
}

//   findOne(id: number) {
//     return `This action returns a #${id} order`;
//   }

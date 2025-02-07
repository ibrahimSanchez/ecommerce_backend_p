import { Decimal } from "@prisma/client/runtime/library";
import { Order, OrderItem } from "@prisma/client";

// DTO para Order
export type OrderDto = Omit<
  Order,
  "id" | "createdAt" | "updatedAt" | "userId"
> & {
  userId: string;
  total_amount: Decimal;
};

export type CreateOrderDto = Omit<Order, "id" | "createdAt" | "updatedAt"> & {
  total_amount: number;
  delivery_address: string;
  userId: string;
  arrayItems: OrderItem[];
};

// DTO para OrderItem
export type OrderItemDto = Omit<OrderItem, "id" | "orderId" | "productId"> & {
  orderId: string;
  productId: string;
  price: Decimal;
};

export type CreateOrderItemDto = Omit<OrderItem, "id"> & {
  price: Decimal;
};

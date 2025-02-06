import { Module } from "@nestjs/common";
import { ProductsModule } from "./products/products.module";
import { PrismaService } from "./prisma/prisma.service";
import { CategoriesModule } from "./categories/categories.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    ProductsModule,
    CategoriesModule,
    AuthModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}

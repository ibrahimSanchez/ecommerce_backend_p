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
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
// import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { AuthGuard } from "src/auth/guard/auth.guard";


@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(":id")
  @Roles('admin_role')
  @UseGuards(AuthGuard, RolesGuard)
  updateProduct(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}

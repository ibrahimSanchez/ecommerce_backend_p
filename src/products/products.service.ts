import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
    try {
      const { imgs, categoryId, ...productData } = createProductDto;
      const categoryExists = await this.prismaService.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        throw new NotFoundException(
         `Category with ID ${categoryId} does not exist.`,
        );
      }

      const images = Array.isArray(imgs) ? imgs : imgs ? [imgs] : [];

      const product = await this.prismaService.product.create({
        data: {
          ...productData,
          categoryId,
          imgs: {
            create: images.map((img) => ({
              thumbnails: img.thumbnails,
              previews: img.previews,
            })),
          },
        },
        include: { imgs: true, category: true }, // Incluir la categoría en la respuesta
      });

      return product;
    } catch (error) {
      console.error("❌ Error en createProduct:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(
            `The product with the name ${createProductDto.title} already exists`,
          );
        }
      }

      throw error;
    }
  }

  async findAll() {
    const products = await this.prismaService.product.findMany({
      include: { imgs: true },
      orderBy: { title: "asc" },
    });

    return products.map(this.formatProductResponse);
  }

  async findOne(id: string) {
    const productFound = await this.prismaService.product.findUnique({
      where: { id },
      include: { imgs: true },
    });

    if (!productFound) {
      throw new NotFoundException(
        `Product with id: ${id} was not found`,
      );
    }

    return this.formatProductResponse(productFound);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const { imgs, ...productData } = updateProductDto;

    const existingProduct = await this.prismaService.product.findUnique({
      where: { id },
      include: { imgs: true },
    });

    if (!existingProduct) {
      throw new NotFoundException(
        `Product with id: ${id} was not found`,
      );
    }

    let imageUpdateData = {};
    if (imgs !== undefined) {
      const images = Array.isArray(imgs) ? imgs : imgs ? [imgs] : [];
      imageUpdateData = {
        deleteMany: {},
        create: images,
      };
    }

    const updatedProduct = await this.prismaService.product.update({
      where: { id },
      data: {
        ...productData,
        ...(imgs !== undefined && { imgs: imageUpdateData }),
      },
      include: { imgs: true },
    });

    return this.formatProductResponse(updatedProduct);
  }

  async remove(id: string) {
    const productFound = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!productFound) {
      throw new NotFoundException(
        `Product with id: ${id} was not found`,
      );
    }

    return await this.prismaService.product.delete({
      where: { id },
    });
  }

  private formatProductResponse(product: any) {
    return {
      ...product,
      imgs: {
        thumbnails: product.imgs?.flatMap((img) => img.thumbnails) || [],
        previews: product.imgs?.flatMap((img) => img.previews) || [],
      },
    };
  }
}

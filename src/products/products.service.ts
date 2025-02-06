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

  async create(createProductDto: CreateProductDto) {
    try {
      const { imgs, categoryId, ...productData } = createProductDto;

      // Verificar si la categoría existe antes de asignarla
      const categoryExists = await this.prismaService.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        throw new NotFoundException(
          `La categoría con ID ${categoryId} no existe.`,
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
            `El producto con el nombre ${createProductDto.title} ya existe`,
          );
        }
      }

      throw error;
    }
  }

  async findAll() {
    const products = await this.prismaService.product.findMany({
      include: { imgs: true },
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
        `El producto con id: ${id} no fue encontrado`,
      );
    }

    return this.formatProductResponse(productFound);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { imgs, ...productData } = updateProductDto;

    const existingProduct = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(
        `El producto con id: ${id} no fue encontrado`,
      );
    }

    const updatedProduct = await this.prismaService.product.update({
      where: { id },
      data: {
        ...productData,
        imgs: {
          deleteMany: {}, // Elimina imágenes antiguas
          create: imgs?.map((img) => ({
            thumbnails: img.thumbnails,
            previews: img.previews,
          })),
        },
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
        `El producto con id: ${id} no fue encontrado`,
      );
    }

    return await this.prismaService.product.delete({
      where: { id },
    });
  }

  // Método para formatear la estructura de imgs como un único objeto
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

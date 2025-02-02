import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async getProductCountByCategory() {
    const productCounts = await this.prismaService.product.groupBy({
      by: ["categoryId"],
      _count: {
        id: true,
      },
    });

    const result = await Promise.all(
      productCounts.map(async (category) => {
        const categoryData = await this.prismaService.category.findUnique({
          where: { id: category.categoryId },
          select: { title: true },
        });

        return {
          categoryId: category.categoryId,
          categoryName: categoryData?.title || "Desconocida",
          productCount: category._count.id,
        };
      }),
    );

    return result;
  }

  // create(createCategoryDto: CreateCategoryDto) {
  //   return "This action adds a new category";
  // }

  async findAll() {
    const categories = await this.prismaService.category.findMany();
    return categories
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} category`;
  // }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}

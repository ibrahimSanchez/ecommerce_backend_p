import { Product } from "@prisma/client";

export type ProductImageDto = {
  thumbnails: string[];
  previews: string[];
};

export type CreateProductDto = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
> & {
  categoryId: number; 
  imgs?: ProductImageDto[];
};

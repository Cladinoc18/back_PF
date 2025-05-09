import { Product } from "src/product/entities/product.entity";
import { productsMock } from "../products/products-mock";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "src/category/entities/category.entity";

@Injectable()
export class ProductsSeed {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) { }

    async findCategories(name: string, type: string, color: string) {
        const findCategory = await this.categoryRepository.findOne({
            where: {
                name: name,
                type: type,
                color: color
            }
        })

        if (!findCategory) {
            throw new Error(`Category name ${name} / type ${type} / color ${color} not found`)
        }
        return findCategory;
    }

    async createSeedProduct() {
        const existingProductNames = (await this.productRepository.find()).map(
            (product) => product.name,
        )

        for (const productData of productsMock) {
            if (!existingProductNames.includes(productData.name)) {
                const newProduct = new Product();
                newProduct.name = productData.name;
                newProduct.description = productData.description;
                newProduct.type = productData.type;
                newProduct.price = productData.price;
                newProduct.designer = productData.designer;
                newProduct.image = productData.image;
                newProduct.stock = productData.stock;
                newProduct.category = await this.findCategories(
                    productData.categoryName,
                    productData.categoryType,
                    productData.categoryColor
                );
                await this.productRepository.save(newProduct);
            } else {
                return "Ya existen productos"
            }
        }
    }
}
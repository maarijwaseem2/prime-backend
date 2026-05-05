import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getHomeData() {
    const categories = await this.categoriesRepository.find({
      take: 6,
      order: { createdAt: 'DESC' } as any,
    });

    const products = await this.productsRepository.find({
      take: 8,
      order: { createdAt: 'DESC' } as any,
      relations: ['categoryProducts', 'categoryProducts.category'],
    });

    return {
      categories,
      products,
    };
  }
}

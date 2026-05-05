import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { CategoryProduct } from '../entities/category-product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(CategoryProduct)
    private categoryProductRepository: Repository<CategoryProduct>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryIds, ...rest } = createProductDto;

    if (!rest.slug || rest.slug.trim() === '') {
      rest.slug = rest.title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    }

    const product = await this.productsRepository.save(
      this.productsRepository.create(rest),
    );

    if (categoryIds && categoryIds.length > 0) {
      const records = categoryIds.map((cid) => ({
        product_id: product.id,
        category_id: cid,
      }));
      await this.categoryProductRepository.insert(records);
    }

    return product;
  }

  async findAll(page: number = 1, limit: number = 12) {
    const [data, total] = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categoryProducts', 'cp')
      .leftJoinAndSelect('cp.category', 'category')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['categoryProducts', 'categoryProducts.category'],
    });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categoryProducts', 'cp')
      .leftJoinAndSelect('cp.category', 'category')
      .where('product.slug = :slug', { slug })
      .getOne();

    if (!product)
      throw new NotFoundException(`Product with slug ${slug} not found`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { categoryIds, ...rest } = updateProductDto;
    const product = await this.findOne(id);

    if (
      updateProductDto.title &&
      (!updateProductDto.slug || updateProductDto.slug.trim() === '')
    ) {
      updateProductDto.slug = updateProductDto.title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    }

    Object.assign(product, rest);

    await this.productsRepository.save(product);

    if (categoryIds) {
      await this.categoryProductRepository.delete({ product_id: id });
      if (categoryIds.length > 0) {
        const records = categoryIds.map((cid) => ({
          product_id: id,
          category_id: cid,
        }));
        await this.categoryProductRepository.insert(records);
      }
    }

    return this.findOne(id);
  }

  async search(q: string) {
    return this.productsRepository.find({
      where: [
        { title: Like(`%${q}%`) },
        { description: Like(`%${q}%`) },
        { short_description: Like(`%${q}%`) },
      ],
      select: ['id', 'title', 'slug', 'image'],
      take: 10,
    });
  }

  async getRelated(productId: number, limit: number = 6) {
    const product = await this.findOne(productId);
    const categoryIds = product.categoryProducts.map((cp) => cp.category_id);

    if (categoryIds.length === 0) return [];

    return this.productsRepository
      .createQueryBuilder('product')
      .innerJoin('product.categoryProducts', 'cp')
      .where('cp.category_id IN (:...categoryIds)', { categoryIds })
      .andWhere('product.id != :productId', { productId })
      .take(limit)
      .getMany();
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productsRepository.remove(product);
  }
}

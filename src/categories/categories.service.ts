import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    if (!createCategoryDto.slug || createCategoryDto.slug.trim() === '') {
      createCategoryDto.slug = createCategoryDto.name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    }
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  findAll() {
    return this.categoriesRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);
    return category;
  }

  async findBySlug(slug: string, page: number = 1, limit: number = 12) {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
    });

    if (!category)
      throw new NotFoundException(`Category with slug ${slug} not found`);

    const skip = (page - 1) * limit;

    const [categoryProducts, total] = await this.categoriesRepository.manager
      .getRepository('CategoryProduct')
      .findAndCount({
        where: { category_id: category.id },
        relations: ['product'],
        take: limit,
        skip: skip,
      });

    return {
      category,
      products: categoryProducts.map((cp: any) => cp.product),
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (
      updateCategoryDto.name &&
      (!updateCategoryDto.slug || updateCategoryDto.slug.trim() === '')
    ) {
      updateCategoryDto.slug = updateCategoryDto.name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    }
    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findMenu() {
    return this.categoriesRepository.find({
      where: { parent_id: IsNull() },
      relations: ['children'],
      order: { name: 'ASC' },
    });
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    return this.categoriesRepository.remove(category);
  }
}

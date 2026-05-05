import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Quote } from '../entities/quote.entity';
import { Contact } from '../entities/contact.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Quote)
    private quoteRepository: Repository<Quote>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async getDashboardData() {
    const products = await this.productRepository.count();
    const categories = await this.categoryRepository.count();
    const quotes = await this.quoteRepository.count();
    const contacts = await this.contactRepository.count();

    const categoriesWithCount = await this.categoryRepository
      .createQueryBuilder('category')
      .loadRelationCountAndMap(
        'category.products_count',
        'category.categoryProducts',
      )
      .getMany();

    const productsByCategory = categoriesWithCount.map((c: any) => ({
      name: c.name,
      value: c.products_count,
    }));

    return {
      counts: {
        products,
        categories,
        quotes,
        contacts,
      },
      chartData: {
        productsByCategory,
        quotesVsContacts: [
          { name: 'Quotes', value: quotes },
          { name: 'Contacts', value: contacts },
        ],
      },
    };
  }
}

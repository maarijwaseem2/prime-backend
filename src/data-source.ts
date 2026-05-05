import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { User } from './entities/user.entity';
import { Quote } from './entities/quote.entity';
import { Contact } from './entities/contact.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'primeLocal',
  entities: [Category, Product, User, Quote, Contact],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

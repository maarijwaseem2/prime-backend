import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Category } from './src/entities/category.entity';
import { Product } from './src/entities/product.entity';
import { User } from './src/entities/user.entity';
import { Quote } from './src/entities/quote.entity';
import { Contact } from './src/entities/contact.entity';
import { PasswordResetToken } from './src/entities/password-reset-token.entity';
import { FailedJob } from './src/entities/failed-job.entity';
import { PersonalAccessToken } from './src/entities/personal-access-token.entity';
import { CategoryProduct } from './src/entities/category-product.entity';

config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'primeLocal',
  entities: [
    User,
    Category,
    Product,
    CategoryProduct,
    Quote,
    Contact,
    PasswordResetToken,
    FailedJob,
    PersonalAccessToken,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

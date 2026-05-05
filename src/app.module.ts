import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { User } from './entities/user.entity';
import { Quote } from './entities/quote.entity';
import { Contact } from './entities/contact.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { FailedJob } from './entities/failed-job.entity';
import { PersonalAccessToken } from './entities/personal-access-token.entity';
import { CategoryProduct } from './entities/category-product.entity';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { QuotesModule } from './quotes/quotes.module';
import { ContactsModule } from './contacts/contacts.module';
import { AdminModule } from './admin/admin.module';
import { HomeController } from './home/home.controller';
import { HomeService } from './home/home.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          Category,
          Product,
          User,
          Quote,
          Contact,
          PasswordResetToken,
          FailedJob,
          PersonalAccessToken,
          CategoryProduct,
        ],
        synchronize: false,
      }),
    }),
    AuthModule,
    CategoriesModule,
    ProductsModule,
    QuotesModule,
    ContactsModule,
    AdminModule,
    TypeOrmModule.forFeature([Product, Category]),
  ],
  controllers: [AppController, HomeController],
  providers: [AppService, HomeService],
})
export class AppModule {}

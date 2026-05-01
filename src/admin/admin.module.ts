import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Quote } from '../entities/quote.entity';
import { Contact } from '../entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, Quote, Contact])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

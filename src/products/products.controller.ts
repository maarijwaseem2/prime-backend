import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search products (Public)' })
  search(@Query('q') q: string) {
    return this.productsService.search(q);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product (Admin)' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products (Public)' })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.productsService.findAll(page ? +page : 1, limit ? +limit : 12);
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'Get related products (Public)' })
  getRelated(@Param('id') id: string) {
    return this.productsService.getRelated(+id);
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get product by ID or Slug (Public)' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    if (/^\d+$/.test(idOrSlug)) {
      return this.productsService.findOne(+idOrSlug);
    }
    return this.productsService.findBySlug(idOrSlug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product (Admin)' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product (Admin)' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}

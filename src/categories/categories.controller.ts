import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('menu')
  @ApiOperation({ summary: 'Get hierarchical categories for menu (Public)' })
  findMenu() {
    return this.categoriesService.findMenu();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category (Admin)' })
  // @UseGuards(JwtAuthGuard) // Will add later
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories (Public)' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category by slug (Public)' })
  findOne(
    @Param('slug') slug: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.categoriesService.findBySlug(
      slug,
      page ? +page : 1,
      limit ? +limit : 12,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category (Admin)' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category (Admin)' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}

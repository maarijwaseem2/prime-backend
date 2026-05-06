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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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

  @Post('upload')
  @ApiOperation({ summary: 'Upload category image' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const relativePath = `categories/${file.filename}`;
    return {
      filename: relativePath,
      url: `/uploads/${relativePath}`,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category (Admin)' })
  // @UseGuards(JwtAuthGuard) // Will add later
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories with pagination (Public)' })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.categoriesService.findAll(
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get category by ID or slug (Public)' })
  findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    if (/^\d+$/.test(idOrSlug)) {
      return this.categoriesService.findOne(+idOrSlug);
    }
    return this.categoriesService.findBySlug(
      idOrSlug,
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

import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname, resolve } from 'path';
import { existsSync } from 'fs';
import * as express from 'express';

const UPLOADS_DIR = resolve(process.cwd(), 'uploads');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Serve uploaded files dynamically.
   * Handles paths like:
   *   /uploads/abc.png
   *   /uploads/products/abc.webp
   */
  @Get('uploads/*path')
  serveFile(@Param('path') path: string, @Res() res: express.Response) {
    try {
      const decodedPath = decodeURIComponent(path);
      // Extract just the filename in case the frontend requested a nested path
      const filename = decodedPath.split('/').pop() || '';

      if (!filename) {
        return res.status(400).json({ message: 'Invalid file path' });
      }

      // Logic: Search in multiple possible locations
      const possiblePaths = [
        // 1. Direct path as requested
        { rel: decodedPath, abs: resolve(UPLOADS_DIR, decodedPath) },
        // 2. In categories subfolder
        {
          rel: join('categories', filename),
          abs: resolve(UPLOADS_DIR, 'categories', filename),
        },
        // 3. In root uploads folder
        { rel: filename, abs: resolve(UPLOADS_DIR, filename) },
      ];

      for (const p of possiblePaths) {
        if (existsSync(p.abs)) {
          return res.sendFile(p.rel, { root: UPLOADS_DIR });
        }
      }

      console.warn(`[Image 404] File not found: ${decodedPath}`);
      return res.status(404).json({ message: 'File not found' });
    } catch (error) {
      console.error('[Image 500] Error serving file:', error);
      return res.status(500).json({
        message: 'Internal server error while serving file',
        error: error.message,
      });
    }
  }

  /**
   * Upload a product image.
   * Files are saved to ./uploads/
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }

    const relativePath = `products/${file.filename}`;
    const appUrl = process.env.APP_URL || 'http://localhost:3001';
    return {
      filename: relativePath,
      url: `${appUrl}/uploads/${relativePath}`,
    };
  }
}

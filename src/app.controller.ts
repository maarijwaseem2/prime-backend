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
      const cleanPath =
        (decodedPath.includes('://')
          ? decodedPath.split('/').pop()
          : decodedPath) || '';

      if (!cleanPath) {
        return res.status(400).json({ message: 'Invalid file path' });
      }

      const filePath = resolve(UPLOADS_DIR, cleanPath);
      if (!existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
      }

      return res.sendFile(cleanPath, { root: UPLOADS_DIR });
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

    const appUrl = process.env.APP_URL || 'http://localhost:3001';
    return {
      filename: file.filename,
      url: `${appUrl}/uploads/${file.filename}`,
    };
  }
}

import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Controller('api/upload')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    if (file.size > +this.configService.get('MAX_FILE_SIZE')) {
      throw new Error('File is too large');
    }
    const filename = Date.now().toString() + '_' + file.originalname;
    const filePath = `./static/${filename}`;
    fs.writeFileSync(filePath, file.buffer);
    const url = `${this.configService.get('API_URL')}/files/${filename}`;
    return {
      url,
      originalName: file.originalname,
      name: filename,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}

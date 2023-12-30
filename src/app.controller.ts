import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { posts as PostEntity, users as UserEntity } from '@prisma/client';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/post')
  getPostsWithPagination(@Query('page') page: string) {
    return this.appService.getPostsWithPagination(+page);
  }

  @Get('/post/:postId')
  getPostWithPostId(@Param('postId') postId: string): PostEntity {
    return this.appService.getPostWithPostId(postId);
  }

  @Post('/post')
  savePost(@Body() payload: Omit<PostEntity, 'id' | 'createdAt'>) {
    return this.appService.savePost(payload);
  }

  @Post('/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, callback) => {
          callback(null, `${Date.now}_${file.originalname}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('This is not a image!'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File): string {
    return file.filename;
  }

  @Post('/login')
  login(@Body() payload: Omit<UserEntity, 'id'>) {
    return this.appService.login(payload);
  }
}

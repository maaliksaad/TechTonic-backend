import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'

import { GetUser } from '@/decorators'
import { TokenGuard } from '@/guards/token.guard'
import { UserDocument } from '@/models'
import { BlogsService } from '@/modules/blogs/blogs.service'
import { BlogIdDto, CreateBlogDto, UpdateBlogDto } from '@/modules/blogs/dtos'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  async getAllPublicBlogs() {
    return await this.blogService.getAllBlogs()
  }

  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  async getPublicBlog(@Param() { id }: BlogIdDto) {
    return await this.blogService.getPublicBlogById(id)
  }

  @UseGuards(TokenGuard)
  @UseInterceptors(CacheInterceptor)
  @Get('user/:id')
  async getBlogs(@GetUser() user: UserDocument) {
    return await this.blogService.getUserCateredAllBlogs(user._id.toString())
  }

  @UseGuards(TokenGuard)
  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  async getBlog(@Param() { id }: BlogIdDto, @GetUser() user: UserDocument) {
    return await this.blogService.getUserCateredAllBlogById(
      id,
      user._id.toString()
    )
  }

  @UseGuards(TokenGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`)
        }
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new NotAcceptableException('Invalid file type'), false)
        }
        cb(null, true)
      }
    })
  )
  async createBlog(
    @Body() body: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: UserDocument
  ) {
    if (!file) {
      throw new NotAcceptableException('No file uploaded')
    }

    const blog = await this.blogService.create({
      title: body.title,
      content: body.content,
      user_id: user._id.toString(),
      category: body.category,
      slug: body.slug,
      image: file.filename
    })

    return await this.blogService.getUserCateredAllBlogById(
      blog._id.toString(),
      user._id.toString()
    )
  }

  @UseGuards(TokenGuard)
  @Patch(':id')
  async updateBlog(
    @Param() { id }: BlogIdDto,
    @Body() body: UpdateBlogDto,
    @GetUser() user: UserDocument
  ) {
    await this.blogService.getUserCateredAllBlogById(id, user._id.toString())

    await this.blogService.update(id, { ...body })

    return await this.blogService.getUserCateredAllBlogById(
      id,
      user._id.toString()
    )
  }

  @UseGuards(TokenGuard)
  @Delete(':id')
  async deleteBlog(@Param() { id }: BlogIdDto, @GetUser() user: UserDocument) {
    const blog = await this.blogService.getUserCateredAllBlogById(
      id,
      user._id.toString()
    )

    await this.blogService.delete(id)

    return blog
  }
}

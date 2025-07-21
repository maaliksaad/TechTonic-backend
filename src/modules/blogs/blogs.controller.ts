import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  Patch,
  Post, // ✅ FIXED: Ensures POST route for create
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

import { GetUser } from '@/decorators'
import { TokenGuard } from '@/guards/token.guard'
import { UserDocument } from '@/models'
import { BlogsService } from '@/modules/blogs/blogs.service'
import { BlogIdDto, CreateBlogDto, UpdateBlogDto } from '@/modules/blogs/dtos'

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  async getAllPublicBlogs() {
    return await this.blogService.getAllBlogs()
  }

  @UseGuards(TokenGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`)
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
  @Get('user')
  async getCurrentUserBlogs(@GetUser() user: UserDocument, @Req() req) {
    console.log('Headers:', req.headers)
    console.log('User in controller:', user)

    if (!user) {
      throw new UnauthorizedException('User not found in request')
    }

    return await this.blogService.getUserCateredAllBlogs(user._id.toString())
  }

  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  async getPublicBlog(@Param() { id }: BlogIdDto) {
    return await this.blogService.getPublicBlogById(id)
  }

  // ✅ FIXED: Changed from @Get(':id') to @Get('auth/:id') to avoid duplicate route
  @UseGuards(TokenGuard)
  @UseInterceptors(CacheInterceptor)
  @Get('auth/:id')
  async getBlog(@Param() { id }: BlogIdDto, @GetUser() user: UserDocument) {
    return await this.blogService.getUserCateredAllBlogById(
      id,
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

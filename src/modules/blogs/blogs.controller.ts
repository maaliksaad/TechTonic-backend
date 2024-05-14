import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'

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

  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  async getPublicBlog(@Param() { id }: BlogIdDto) {
    return await this.blogService.getPublicBlogById(id)
  }

  @UseGuards(TokenGuard)
  @UseInterceptors(CacheInterceptor)
  @Get()
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
  async createBlog(@Body() body: CreateBlogDto, @GetUser() user: UserDocument) {
    const blog = await this.blogService.create({
      title: body.title,
      content: body.content,
      user_id: user._id.toString(),
      category: body.category,
      slug: body.slug,
      image: body.image
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

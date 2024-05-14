import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dtos'
import { UserDocument } from '@/models'
import { GetUser } from '@/decorators'
import { BlogIdDto } from '../blogs/dtos'
import { TokenGuard } from '@/guards/token.guard'
import { CacheInterceptor } from '@nestjs/cache-manager'

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  async getCommentsByBlogId(@Param() { id }: BlogIdDto) {
    return await this.commentsService.getCommentsByBlogId(id)
  }

  @UseGuards(TokenGuard)
  @Post(':id')
  async createComment(
    @Param() { id }: BlogIdDto,
    @Body() Body: CreateCommentDto,
    @GetUser() user: UserDocument
  ) {
    return await this.commentsService.createComment({
      content: Body.content,
      user_id: user._id.toString(),
      blog_id: id.toString()
    })
  }
}

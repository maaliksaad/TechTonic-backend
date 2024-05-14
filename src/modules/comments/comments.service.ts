import { Comment, type CommentDocument } from '@/models'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { type CreateCommentDto } from './dtos'

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>
  ) {}

  async getCommentsByBlogId(blog_id: string) {
    return await this.commentModel
      .find({ blog: blog_id })
      .populate({
        path: 'user',
        select: '-password'
      })
      .exec()
  }

  async createComment({
    content,
    user_id,
    blog_id
  }: CreateCommentDto & { user_id: string; blog_id: string }) {
    const comment = await this.commentModel.create({
      content,
      user: user_id,
      blog: blog_id
    })
    return comment.toObject()
  }
}

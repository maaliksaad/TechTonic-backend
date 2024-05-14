import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Blog, type BlogDocument } from '@/models'
import { AuthService } from '@/modules/auth/auth.service'
import { type CreateBlogDto, type UpdateBlogDto } from '@/modules/blogs/dtos'

@Injectable()
export class BlogsService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>
  ) {}

  async getUserCateredAllBlogs(user_id: string) {
    return await this.blogModel.find({ user: user_id }).exec()
  }

  async getAllBlogs() {
    return await this.blogModel.find().exec()
  }

  async getUserCateredAllBlogById(id: string, user_id: string) {
    const blog = await this.blogModel
      .findOne({ _id: id, user: user_id })
      .populate({
        path: 'user',
        select: '-password'
      })
      .exec()

    if (blog == null) {
      throw new NotFoundException({
        message: 'Blog not found'
      })
    }

    return blog
  }

  async getPublicBlogById(id: string) {
    const blog = await this.blogModel.findById(id).exec()

    if (blog == null) {
      throw new NotFoundException({
        message: 'Blog not found'
      })
    }

    return blog
  }

  async create({
    title,
    content,
    category,
    slug,
    image,
    user_id
  }: CreateBlogDto & { user_id: string }) {
    const blog = await this.blogModel.create({
      title,
      content,
      user: user_id,
      category,
      slug,
      image
    })
    return blog.toObject()
  }

  async update(
    id: string,
    { title, content, category, slug, image }: UpdateBlogDto
  ) {
    return await this.blogModel.findByIdAndUpdate(
      id,
      { title, content, category, slug, image },
      { new: true }
    )
  }

  async delete(id: string) {
    return await this.blogModel.findByIdAndDelete(id)
  }

  async deleteUsersBlogs(user_id: string) {
    return await this.blogModel.deleteMany({ user: user_id })
  }
}

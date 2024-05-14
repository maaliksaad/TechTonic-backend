import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Blog, BlogSchema } from 'src/models/blog.model'

import { AuthModule } from '@/modules/auth/auth.module'
import { BlogsController } from '@/modules/blogs/blogs.controller'
import { BlogsService } from '@/modules/blogs/blogs.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    forwardRef(() => AuthModule)
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService]
})
export class BlogsModule {}

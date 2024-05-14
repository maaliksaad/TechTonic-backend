import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, now } from 'mongoose'
import { UserDocument } from './user.model'
import { BlogDocument } from './blog.model'

@Schema()
export class Comment {
  @Prop({
    required: true,
    type: String,
    trim: true
  })
  content: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    required: true,
    ref: 'User'
  })
  user: string | UserDocument

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    required: true,
    ref: 'Blog'
  })
  blog: string | BlogDocument

  @Prop({ default: now() })
  createdAt: Date

  @Prop({ default: now() })
  updatedAt: Date
}

export type CommentDocument = HydratedDocument<Comment>

export const CommentSchema = SchemaFactory.createForClass(Comment)

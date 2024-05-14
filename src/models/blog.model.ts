import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { now, type HydratedDocument } from 'mongoose'

import { type UserDocument } from './user.model'

@Schema()
export class Blog {
  @Prop({
    required: true,
    type: String,
    trim: true
  })
  title: string

  @Prop({
    required: true,
    type: String,
    trim: true
  })
  content: string

  @Prop({
    required: true,
    type: String,
    trim: true
  })
  category: string

  @Prop({
    required: true,
    type: String,
    trim: true
  })
  slug: string

  @Prop({
    type: String,
    trim: true
  })
  image: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    required: true,
    ref: 'User'
  })
  user: string | UserDocument

  @Prop({ default: now() })
  createdAt: Date

  @Prop({ default: now() })
  updatedAt: Date
}

export type BlogDocument = HydratedDocument<Blog>

export const BlogSchema = SchemaFactory.createForClass(Blog)

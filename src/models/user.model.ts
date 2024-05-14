import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { now, type HydratedDocument } from 'mongoose'

@Schema()
export class User {
  @Prop({
    required: true,
    type: String,
    trim: true
  })
  name: string

  @Prop({
    required: true,
    type: String,
    trim: true
  })
  email: string

  @Prop({
    required: true,
    type: String
  })
  password: string

  @Prop({
    type: String
  })
  image: string

  @Prop({ default: now() })
  createdAt: Date

  @Prop({ default: now() })
  updatedAt: Date
}

export type UserDocument = HydratedDocument<User>

export const UserSchema = SchemaFactory.createForClass(User)

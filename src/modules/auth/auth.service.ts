import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User, type UserDocument } from '@/models'
import { type RegisterDto } from '@/modules/auth/dtos'
import { BlogsService } from '@/modules/blogs/blogs.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly blogsService: BlogsService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email })

    return user?.toObject()
  }

  async register({ email, password, name, image }: RegisterDto) {
    const user = await this.userModel.create({
      email,
      password,
      name,
      image
    })

    return user.toObject()
  }

  async generateToken(user: UserDocument) {
    return this.jwtService.sign(
      { id: user._id }, // Use 'id' to match your strategy
      { expiresIn: '1d' }
    )
  }

  async deleteUser(user_id: string) {
    await this.blogsService.deleteUsersBlogs(user_id)

    return await this.userModel.findByIdAndDelete(user_id)
  }
}

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { PassportStrategy } from '@nestjs/passport'
import { Model } from 'mongoose'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { User, type UserDocument } from '@/models'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_SECRET')
    })
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload)
    const user = await this.userModel.findById(payload.id)
    if (!user) {
      console.log('User not found for id:', payload.id)
      return null
    }
    return user.toObject()
  }
}

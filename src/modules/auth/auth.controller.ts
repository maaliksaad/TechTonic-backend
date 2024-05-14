import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'

import { GetUser } from '@/decorators'
import { TokenGuard } from '@/guards/token.guard'
import { UserDocument } from '@/models'
import { AuthService } from '@/modules/auth/auth.service'
import { LoginDto, RegisterDto } from '@/modules/auth/dtos'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.getUserByEmail(body.email)

    if (user != null) {
      throw new BadRequestException({
        message: 'User already exists'
      })
    }

    const createdUser = await this.authService.register({
      email: body.email,
      password: body.password,
      name: body.name,
      image: body.image
    })
    const token = await this.authService.generateToken(createdUser)

    return { ...createdUser, token }
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.getUserByEmail(body.email)

    if (user == null) {
      throw new NotFoundException({
        message: 'User not found'
      })
    }

    if (user.password !== body.password) {
      throw new UnauthorizedException({
        message: 'Incorrect Password'
      })
    }

    const token = await this.authService.generateToken(user)

    return { ...user, token }
  }

  @UseGuards(TokenGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id') user_id: string,
    @GetUser() user: UserDocument
  ) {
    if (user._id.toString() !== user_id) {
      throw new UnauthorizedException({
        message: 'Unauthorized'
      })
    }

    return await this.authService.deleteUser(user._id.toString())
  }
}

import { createParamDecorator, type ExecutionContext } from '@nestjs/common'

import { type UserDocument } from '@/models'

export const GetUser = createParamDecorator<keyof UserDocument>(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()

    if (!request.user) {
      return null
    }

    if (data) {
      return request.user[data]
    }

    return request.user
  }
)

import { Injectable, Logger, type NestMiddleware } from '@nestjs/common'
import { type Request, type Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger()

  use(request: Request, response: Response, next) {
    const { method, originalUrl, ip, body } = request
    const userAgent = request.get('user-agent') ?? ''

    response.on('finish', () => {
      const { statusCode } = response
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${JSON.stringify(
          body
        )} - ${userAgent} ${ip}`
      )
    })

    next()
  }
}

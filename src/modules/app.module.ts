import { CacheModule } from '@nestjs/cache-manager'
import {
  type MiddlewareConsumer,
  Module,
  type NestModule
} from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import { LoggerMiddleware } from '@/middlewares'
import { AuthModule } from '@/modules/auth/auth.module'
import { BlogsModule } from '@/modules/blogs/blogs.module'
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow('MONGODB_URI')
      }),
      inject: [ConfigService]
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_SECRET')
      }),
      inject: [ConfigService]
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 5000,
      max: 100
    }),
    AuthModule,
    BlogsModule,
    CommentsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}

import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import { EventModule } from '@/event/event.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';

import { User, UserSchema } from '@/user/entities/user.entity';
import { HttpLoggerMiddleware } from '@/middleware/logger.middleware';
import { ReviewModule } from './review/review.module';
import { TicketModule } from './ticket/ticket.module';
import { ImageModule } from './image/image.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'defaultsecret',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EventModule,
    UserModule,
    AuthModule,
    ReviewModule,
    TicketModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
      )
      .forRoutes('*'); // Apply to all other routes
  }
}

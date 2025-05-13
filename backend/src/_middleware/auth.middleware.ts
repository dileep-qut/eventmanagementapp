import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { IUser, User, UserDocument } from '@/user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface RequestWithUser extends Request {
  user?: Omit<UserDocument, 'password'>;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    // Check if the authorization header is present
    if (!authHeader) {
      return next();
    }

    // Check if the authorization header is in the correct format
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Invalid authorization header format or malformed format',
      );
    }

    let payload: any;
    try {
      // 1) verify the JWT
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as jwt.JwtPayload;
    } catch (err) {
      throw new UnauthorizedException('The token is invalid or expired');
    }

    const user = await this.userModel
      .findById(payload.id)
      .select('-password')
      .lean();
    if (!user) {
      throw new UnauthorizedException(
        'User not found, this user might be disabled or deleted',
      );
    }

    req.user = user as Omit<UserDocument, 'password'>;
    return next();
  }
}

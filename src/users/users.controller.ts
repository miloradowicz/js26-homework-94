import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Error, Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenAuthGuard } from 'src/token-auth/token-auth.guard';
import { PermitGuard } from 'src/permitter/permitter.guard';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @Post()
  async register(@Body() userDto: CreateUserDto) {
    try {
      const user = await this.userModel.create({ ...userDto });

      user.generateToken();
      return user;
    } catch (e) {
      if (e instanceof Error.ValidationError) {
        throw new BadRequestException(e);
      }

      throw e;
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  login(@Req() req: Request & { user: UserDocument }) {
    return req.user;
  }

  @UseGuards(TokenAuthGuard, PermitGuard('user', 'admin'))
  @Delete('sessions')
  async logout(@Req() req: Request & { user: UserDocument }) {
    const user = await this.userModel.findById(req.user._id);

    if (user) {
      user.clearToken();
      await user.save();
    }

    return { user: null };
  }
}

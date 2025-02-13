import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { CreateArtistDto } from './create-artist.dto';
import config from '../config';
import { join } from 'path';
import { CustomFileInterceptor } from '../custom-file/custom-file.interceptor';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @Post()
  @UseInterceptors(
    CustomFileInterceptor(
      'photo',
      join(config.rootPath, config.publicPath, 'uploads', 'artists'),
    ),
  )
  async createOne(
    @Body() artistDto: CreateArtistDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const artist = await this.artistModel.create({
        ...artistDto,
        photoUrl: file ? '/uploads/artists/' + file.filename : null,
      });

      return artist;
    } catch (e) {
      if (e instanceof Error.ValidationError) {
        throw new BadRequestException(e);
      }

      throw e;
    }
  }

  @Get()
  async getAll() {
    return this.artistModel.find();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      const artist = await this.artistModel.findById(id);

      if (!artist) {
        throw new NotFoundException({ error: 'Artist not found' });
      }

      return artist;
    } catch (e) {
      if (e instanceof Error.CastError) {
        throw new BadRequestException({ error: 'Invalid id' });
      }

      throw e;
    }
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    try {
      const artist = await this.artistModel.findById(id);

      if (!artist) {
        throw new NotFoundException({ error: 'Artist not found.' });
      }

      await artist.deleteOne();
      return null;
    } catch (e) {
      if (e instanceof Error.CastError) {
        throw new BadRequestException({ error: 'Invalid id' });
      }

      throw e;
    }
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { CreateArtistDto } from './create-artist.dto';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @Post()
  async createOne(@Body() artistDto: CreateArtistDto) {
    try {
      const artist = await this.artistModel.create({ ...artistDto });

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

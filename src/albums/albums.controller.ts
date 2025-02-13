import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { CreateAlbumDto } from './create-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @Post()
  async createOne(@Body() albumDto: CreateAlbumDto) {
    try {
      const album = await this.albumModel.create({ ...albumDto });

      return album;
    } catch (e) {
      if (e instanceof Error.ValidationError) {
        throw new BadRequestException(e);
      }

      throw e;
    }
  }

  @Get()
  async get(@Query('artist') _artist: string) {
    {
      try {
        let artist: ArtistDocument | null = null;

        if (_artist) {
          artist = await this.artistModel.findById(_artist);

          if (!artist) {
            throw new NotFoundException({ error: 'Artist not found' });
          }
        }

        const albums = await this.albumModel
          .aggregate([
            {
              $match: artist ? { artist: artist._id } : {},
            },
            {
              $lookup: {
                from: 'tracks',
                localField: '_id',
                foreignField: 'album',
                as: 'tracks',
              },
            },
            {
              $group: {
                _id: {
                  doc: {
                    $unsetField: {
                      field: 'tracks',
                      input: '$$ROOT',
                    },
                  },
                },
                trackCount: { $sum: { $size: '$tracks' } },
              },
            },
            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: ['$$ROOT', '$_id.doc'],
                },
              },
            },
            {
              $project: {
                __v: 0,
              },
            },
          ])
          .sort('year');

        return artist ? { albums, artist } : { albums };
      } catch (e) {
        if (e instanceof Error.CastError) {
          throw new BadRequestException({ error: 'Invalid id' });
        }
        throw e;
      }
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      const album = await this.albumModel.findById(id);

      if (!album) {
        throw new NotFoundException({ error: 'Album not found' });
      }

      return album;
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
      const album = await this.albumModel.findById(id);

      if (!album) {
        throw new NotFoundException({ error: 'Album not found.' });
      }

      await album.deleteOne();
      return null;
    } catch (e) {
      if (e instanceof Error.CastError) {
        throw new BadRequestException({ error: 'Invalid id' });
      }

      throw e;
    }
  }
}

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
import { Track, TrackDocument } from '../schemas/track.schema';
import { CreateTrackDto } from './create-track.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @Post()
  async createOne(@Body() trackDto: CreateTrackDto) {
    try {
      const track = await this.trackModel.create({ ...trackDto });

      return track;
    } catch (e) {
      if (e instanceof Error.ValidationError) {
        throw new BadRequestException(e);
      }

      throw e;
    }
  }

  @Get()
  async get(@Query('artist') _artist: string, @Query('album') _album: string) {
    let artist: ArtistDocument | null = null;
    let album: AlbumDocument | null = null;

    try {
      if (_artist) {
        artist = await this.artistModel.findById(_artist);

        if (!artist) {
          throw new NotFoundException({ error: 'Artist not found.' });
        }
      }

      if (_album) {
        album = await this.albumModel.findById(_album);

        if (!album) {
          throw new NotFoundException({ error: 'Album not found.' });
        }

        const _artist = await this.artistModel.findById(album.artist);

        if (!_artist) {
          throw new NotFoundException({ error: 'Album artist not found.' });
        }

        if (!artist) {
          artist = _artist;
        } else if (!artist._id.equals(_artist._id)) {
          throw new NotFoundException({
            error: 'Album does not belong to artist',
          });
        }
      }

      const tracks = await this.trackModel.aggregate([
        {
          $lookup: {
            from: 'albums',
            localField: 'album',
            foreignField: '_id',
            as: 'album',
          },
        },
        {
          $unwind: '$album',
        },
        {
          $lookup: {
            from: 'artists',
            localField: 'album.artist',
            foreignField: '_id',
            as: 'artist',
          },
        },
        {
          $unwind: '$artist',
        },
        {
          $match: {
            $and: [
              artist ? { 'artist._id': artist._id } : {},
              album ? { 'album._id': album._id } : {},
            ],
          },
        },
        {
          $sort: { 'artist.name': 1, 'album.year': 1, trackNum: 1 },
        },
        {
          $replaceWith: {
            $setField: {
              field: 'album',
              value: '$album._id',
              input: '$$ROOT',
            },
          },
        },
        {
          $replaceWith: {
            $setField: {
              field: 'artist',
              value: '$artist._id',
              input: '$$ROOT',
            },
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ]);

      return album
        ? { tracks, album, artist }
        : artist
          ? { tracks, artist }
          : { tracks };
    } catch (e) {
      if (e instanceof Error.CastError) {
        throw new BadRequestException({ error: 'Invalid id' });
      }

      throw e;
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      const track = await this.trackModel.findById(id);

      if (!track) {
        throw new NotFoundException({ error: 'Track not found' });
      }

      return track;
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
      const track = await this.trackModel.findById(id);

      if (!track) {
        throw new NotFoundException({ error: 'Track not found.' });
      }

      await track.deleteOne();
      return null;
    } catch (e) {
      if (e instanceof Error.CastError) {
        throw new BadRequestException({ error: 'Invalid id' });
      }

      throw e;
    }
  }
}

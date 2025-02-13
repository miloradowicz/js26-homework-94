import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Artist } from './artist.schema';

export type AlbumDocument = HydratedDocument<Album>;

@Schema()
export class Album {
  @Prop({ required: [true, 'title is required'] })
  title: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Artist is required'],
  })
  artist: Artist;

  @Prop({ required: [true, 'year is required'] })
  year: number;

  @Prop()
  coverUrl: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);

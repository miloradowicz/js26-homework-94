import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Album } from './album.schema';

export type TrackDocument = HydratedDocument<Track>;

@Schema()
export class Track {
  @Prop({ required: [true, 'title is required'] })
  title: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: [true, 'album is required'],
  })
  album: Album;

  @Prop({ required: [true, 'track number is required'] })
  trackNum: number;

  @Prop()
  length: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);

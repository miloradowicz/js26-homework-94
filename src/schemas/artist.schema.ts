import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema({ versionKey: false })
export class Artist {
  @Prop({ required: [true, 'name is required'] })
  name: string;

  @Prop({
    type: String,
    default: null,
  })
  photoUrl: string | null;

  @Prop({
    type: String,
    default: null,
  })
  description: string | null;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);

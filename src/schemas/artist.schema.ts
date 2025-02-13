import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema()
export class Artist {
  @Prop({ required: [true, 'name is required'] })
  name: string;

  @Prop()
  photoUrl: string;

  @Prop()
  description: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);

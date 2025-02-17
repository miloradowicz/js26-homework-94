import { IsNotEmpty, IsMongoId, Min, Max } from 'class-validator';
import { DocumentExists } from '../document-exists/document-exists';
import { Artist } from '../schemas/artist.schema';
import { Transform } from 'class-transformer';

export class CreateAlbumDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsMongoId()
  @DocumentExists(Artist.name)
  artist: Artist;

  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value as string))
  @Min(1900)
  @Max(2030)
  year: number;
}

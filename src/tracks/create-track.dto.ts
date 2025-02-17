import { Transform } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DocumentExists } from '../document-exists/document-exists';
import { Album } from '../schemas/album.schema';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsMongoId()
  @DocumentExists(Album)
  album: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value as string))
  @Min(1)
  trackNum: number;

  @IsOptional()
  @IsString()
  length?: string;
}

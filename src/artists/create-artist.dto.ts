import {
  IsNotEmpty,
  IsAlphanumeric,
  Length,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateArtistDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(3, 30)
  name: string;

  @IsOptional()
  @IsString()
  description: string | null;
}

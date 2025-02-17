import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ArtistsController } from './artists/artists.controller';
import { AlbumsController } from './albums/albums.controller';
import { TracksController } from './tracks/tracks.controller';
import config from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { Album, AlbumSchema } from './schemas/album.schema';
import { Track, TrackSchema } from './schemas/track.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users/users.controller';
import { AuthService } from './auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { DocumentExistsRule } from './document-exists/document-exists.rule';

@Module({
  imports: [
    MongooseModule.forRoot([config.mongo.host, config.mongo.db].join('')),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Track.name, schema: TrackSchema },
    ]),
    PassportModule,
  ],
  controllers: [
    UsersController,
    ArtistsController,
    AlbumsController,
    TracksController,
  ],
  providers: [AppService, AuthService, LocalStrategy, DocumentExistsRule],
})
export class AppModule {}

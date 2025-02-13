import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from './app.module';
import { Album } from './schemas/album.schema';
import { Artist } from './schemas/artist.schema';
import { Track } from './schemas/track.schema';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const artists = moduleFixture.get<Model<Artist>>(
      getModelToken(Artist.name),
    );

    const albums = moduleFixture.get<Model<Album>>(getModelToken(Album.name));

    const tracks = moduleFixture.get<Model<Track>>(getModelToken(Track.name));
    try {
      await artists.deleteMany();
      await albums.deleteMany();
      await tracks.deleteMany();

      const [babymetal, eluveitie, dethklok, faun] = await artists.create(
        {
          name: 'Babymetal',
          photoUrl: 'uploads/artists/_babymetal.jpg',
          description: 'Kawaii metal band from Japan',
        },
        {
          name: 'Eluveitie',
          photoUrl: 'uploads/artists/_eluveitie.jpg',
          description: 'Folk metal band from Switzerland',
        },
        {
          name: 'Dethklok',
          photoUrl: 'uploads/artists/_dethklok.jpg',
          description: 'Death metal band from the USA',
        },
        {
          name: 'Faun',
          photoUrl: 'uploads/artists/_faun.jpg',
          description: 'Folk rock band from Germany',
        },
      );

      const [
        babymetal_babymetal,
        babymetal_metalResistance,
        babymetal_metalGalaxy,
        eluveitie_spirit,
        eluveitie_slania,
        eluveitie_helvetios,
        dethklok_theDeathalbum,
        dethklok_deathalbum2,
        faun_eden,
        faun_luna,
        faun_midgard,
      ] = await albums.create(
        {
          title: 'Babymetal',
          artist: babymetal._id,
          year: 2014,
          coverUrl: 'uploads/albums/_babymetal_babymetal.jpg',
        },
        {
          title: 'Metal Resistance',
          artist: babymetal._id,
          year: 2016,
          coverUrl: 'uploads/albums/_babymetal_metal-resistance.jpg',
        },
        {
          title: 'Metal Galaxy',
          artist: babymetal._id,
          year: 2019,
          coverUrl: 'uploads/albums/_babymetal_metal-galaxy.jpg',
        },
        {
          title: 'Spirit',
          artist: eluveitie._id,
          year: 2006,
          coverUrl: 'uploads/albums/_eluveitie_spirit.jpg',
        },
        {
          title: 'Slania',
          artist: eluveitie._id,
          year: 2008,
          coverUrl: 'uploads/albums/_eluveitie_slania.jpg',
        },
        {
          title: 'Helvetios',
          artist: eluveitie._id,
          year: 2012,
          coverUrl: 'uploads/albums/_eluveitie_helvetios.jpg',
        },
        {
          title: 'The Deathalbum',
          artist: dethklok._id,
          year: 2007,
          coverUrl: 'uploads/albums/_dethklok_the-deathalbum.jpg',
        },
        {
          title: 'Deathalbum II',
          artist: dethklok._id,
          year: 2009,
          coverUrl: 'uploads/albums/_dethklok_deathalbum-ii.jpg',
        },
        {
          title: 'Eden',
          artist: faun._id,
          year: 2011,
          coverUrl: 'uploads/albums/_faun_eden.jpg',
        },
        {
          title: 'Luna',
          artist: faun._id,
          year: 2014,
          coverUrl: 'uploads/albums/_faun_luna.jpg',
        },
        {
          title: 'Midgard',
          artist: faun._id,
          year: 2016,
          coverUrl: 'uploads/albums/_faun_midgard.jpg',
        },
      );

      await tracks.create(
        {
          title: 'Light and Darkness',
          album: babymetal_babymetal._id,
          trackNum: 1,
          length: '5:46',
        },
        {
          title: 'Megitsune',
          album: babymetal_babymetal._id,
          trackNum: 2,
          length: '4:07',
        },
        {
          title: 'Gimme Chocolate!!',
          album: babymetal_babymetal._id,
          trackNum: 3,
          length: '3:50',
        },
        {
          title: 'Iine!',
          album: babymetal_babymetal._id,
          trackNum: 4,
          length: '4:08',
        },
        {
          title: 'Akatsuki',
          album: babymetal_babymetal._id,
          trackNum: 5,
          length: '5:25',
        },
        {
          title: 'Road of Resistance',
          album: babymetal_metalResistance._id,
          trackNum: 1,
          length: '5:18',
        },
        {
          title: 'Karate',
          album: babymetal_metalResistance._id,
          trackNum: 2,
          length: '4:23',
        },
        {
          title: 'Awadama Fever',
          album: babymetal_metalResistance._id,
          trackNum: 3,
          length: '4:13',
        },
        {
          title: 'Yava!',
          album: babymetal_metalResistance._id,
          trackNum: 4,
          length: '3:48',
        },
        {
          title: 'Amore',
          album: babymetal_metalResistance._id,
          trackNum: 5,
          length: '4:39',
        },
        {
          title: 'Future Metal',
          album: babymetal_metalGalaxy._id,
          trackNum: 1,
          length: '2:05',
        },
        {
          title: 'Da Da Dance',
          album: babymetal_metalGalaxy._id,
          trackNum: 2,
          length: '3:51',
        },
        {
          title: 'Elevator Girl',
          album: babymetal_metalGalaxy._id,
          trackNum: 3,
          length: '2:46',
        },
        {
          title: 'Shanti Shanti Shanti',
          album: babymetal_metalGalaxy._id,
          trackNum: 4,
          length: '3:10',
        },
        {
          title: 'Oh! Majinai',
          album: babymetal_metalGalaxy._id,
          trackNum: 5,
          length: '3:14',
        },
        {
          title: 'Spirit',
          album: eluveitie_spirit._id,
          trackNum: 1,
          length: '2:32',
        },
        {
          title: 'uis Elveti',
          album: eluveitie_spirit._id,
          trackNum: 2,
          length: '4:24',
        },
        {
          title: 'Your Gaulish War',
          album: eluveitie_spirit._id,
          trackNum: 3,
          length: '5:11',
        },
        {
          title: 'Of Fire, Wind & Wisdom',
          album: eluveitie_spirit._id,
          trackNum: 4,
          length: '3:05',
        },
        {
          title: 'Samon',
          album: eluveitie_slania._id,
          trackNum: 5,
          length: '1:49',
        },
        {
          title: 'Primordial Breath',
          album: eluveitie_slania._id,
          trackNum: 1,
          length: '4:19',
        },
        {
          title: 'Inis Mona',
          album: eluveitie_slania._id,
          trackNum: 2,
          length: '4:09',
        },
        {
          title: 'Gray Sublime Archon',
          album: eluveitie_slania._id,
          trackNum: 3,
          length: '4:21',
        },
        {
          title: 'Anagantios',
          album: eluveitie_slania._id,
          trackNum: 4,
          length: '3:25',
        },
        {
          title: 'Prologue',
          album: eluveitie_helvetios._id,
          trackNum: 1,
          length: '1:24',
        },
        {
          title: 'Helvetios',
          album: eluveitie_helvetios._id,
          trackNum: 2,
          length: '4:00',
        },
        {
          title: 'Luxtos',
          album: eluveitie_helvetios._id,
          trackNum: 3,
          length: '3:56',
        },
        {
          title: 'Home',
          album: eluveitie_helvetios._id,
          trackNum: 4,
          length: '5:16',
        },
        {
          title: 'Santonian Shores',
          album: eluveitie_helvetios._id,
          trackNum: 5,
          length: '3:58',
        },

        {
          title: 'Murmaider',
          album: dethklok_theDeathalbum._id,
          trackNum: 1,
          length: '3:24',
        },
        {
          title: 'Go into the Water',
          album: dethklok_theDeathalbum._id,
          trackNum: 2,
          length: '4:20',
        },
        {
          title: 'Awaken',
          album: dethklok_theDeathalbum._id,
          trackNum: 3,
          length: '3:37',
        },
        {
          title: 'Bloodrocuted',
          album: dethklok_theDeathalbum._id,
          trackNum: 4,
          length: '2:18',
        },
        {
          title: 'Go Forth and Die',
          album: dethklok_theDeathalbum._id,
          trackNum: 5,
          length: '4:22',
        },
        {
          title: 'Bloodlines',
          album: dethklok_deathalbum2._id,
          trackNum: 1,
          length: '3:30',
        },
        {
          title: 'The Gears',
          album: dethklok_deathalbum2._id,
          trackNum: 2,
          length: '4:21',
        },
        {
          title: 'Burn the Earth',
          album: dethklok_deathalbum2._id,
          trackNum: 3,
          length: '3:59',
        },
        {
          title: 'Laser Cannon Death Sentence',
          album: dethklok_deathalbum2._id,
          trackNum: 4,
          length: '4:35',
        },
        {
          title: 'Black Fire Upon Us',
          album: dethklok_deathalbum2._id,
          trackNum: 5,
          length: '5:40',
        },
        {
          title: 'Feuer',
          album: faun_eden._id,
          trackNum: 1,
          length: '3:15',
        },
        {
          title: 'Walpurgisnacht',
          album: faun_eden._id,
          trackNum: 2,
          length: '4:02',
        },
        {
          title: 'Galdra',
          album: faun_eden._id,
          trackNum: 3,
          length: '3:21',
        },
        {
          title: 'The Butterfly',
          album: faun_eden._id,
          trackNum: 4,
          length: '1:33',
        },
        {
          title: 'Adam Lay Yboundun',
          album: faun_eden._id,
          trackNum: 5,
          length: '4:36',
        },
        {
          title: 'Luna Prolog',
          album: faun_luna._id,
          trackNum: 1,
          length: '1:25',
        },
        {
          title: 'Walpurgisnacht',
          album: faun_luna._id,
          trackNum: 2,
          length: '3:49',
        },
        {
          title: 'Brutes Volk',
          album: faun_luna._id,
          trackNum: 3,
          length: '4:16',
        },
        {
          title: 'Menuett',
          album: faun_luna._id,
          trackNum: 4,
          length: '4:56',
        },
        {
          title: 'Hekate',
          album: faun_luna._id,
          trackNum: 5,
          length: '4:15',
        },
        {
          title: 'Midgard Prolog',
          album: faun_midgard._id,
          trackNum: 1,
          length: '0:50',
        },
        {
          title: 'Federkleid',
          album: faun_midgard._id,
          trackNum: 2,
          length: '4:42',
        },
        {
          title: 'Sonnenreigen (Luchnasad)',
          album: faun_midgard._id,
          trackNum: 3,
          length: '3:54',
        },
        {
          title: 'Alba II Intro',
          album: faun_midgard._id,
          trackNum: 4,
          length: '1:50',
        },
        {
          title: 'Alba II',
          album: faun_midgard._id,
          trackNum: 5,
          length: '6:10',
        },
      );
    } catch (e) {
      console.error(e);
    }
  });

  afterAll(() => {});

  it('Fixturing', (done) => {
    done();
  });
});

import { UpdateMusicDataDto } from './dto/update-music-data.dto';
import { PagingDto } from './../common/dto/paging.dto';
import { MusicDataDto } from './dto/music-data.dto';
import { User } from 'src/entities/user.entity';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Music } from 'src/entities/music.entity';
import {
  Brackets,
  EntityRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

@EntityRepository(Music)
export class MusicRepository extends Repository<Music> {
  orderSelectQuery(query: SelectQueryBuilder<Music>) {
    return query
      .orderBy('music.count', 'DESC')
      .addOrderBy('likesCount', 'DESC')
      .addOrderBy('repostsCount', 'DESC');
  }

  musicSimpleQuery() {
    return this.createQueryBuilder('music')
      .leftJoinAndSelect('music.user', 'user')
      .loadRelationCountAndMap('music.likesCount', 'music.likes')
      .loadRelationCountAndMap('music.commentsCount', 'music.comments')
      .loadRelationCountAndMap('music.playlistsCount', 'music.playlists')
      .loadRelationCountAndMap('music.repostsCount', 'music.reposts');
  }

  musicDetailQuery() {
    return this.createQueryBuilder('music')
      .leftJoinAndSelect('music.user', 'user')
      .leftJoinAndSelect('music.playlists', 'playlists')
      .leftJoinAndSelect('playlists.user', 'pu')
      .leftJoinAndSelect('music.likes', 'likes')
      .leftJoinAndSelect('music.reposts', 'reposts')
      .leftJoinAndSelect('music.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'cu')
      .loadRelationCountAndMap('music.likesCount', 'music.likes')
      .loadRelationCountAndMap('likes.followersCount', 'likes.followers')
      .loadRelationCountAndMap('reposts.followersCount', 'reposts.followers')
      .loadRelationCountAndMap('cu.followersCount', 'cu.followers')
      .loadRelationCountAndMap('music.commentsCount', 'music.comments')
      .loadRelationCountAndMap('music.playlistsCount', 'music.playlists')
      .loadRelationCountAndMap('music.repostsCount', 'music.reposts');
  }

  // Create
  async createMusic(createMusicData: MusicDataDto, user: User): Promise<Music> {
    const { permalink } = createMusicData;

    const existMusics = await this.findOne({ permalink, user });

    const music = this.create({
      ...createMusicData,
      permalink: !existMusics ? permalink : `${permalink}_${Date.now()}`,
      user,
    });

    try {
      await this.save(music);
      return music;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        error,
        `Error ocuur create music.`,
      );
    }
  }

  // Find
  async getAllMusic(): Promise<Music[]> {
    try {
      const musics = await this.musicSimpleQuery()
        .where('music.status = :status', { status: 'PUBLIC' })
        .getMany();
      return musics;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error, 'Error to get musics');
    }
  }

  async findMusicById(id: number): Promise<Music> {
    const music = await this.musicDetailQuery()
      .where('music.id = :id', { id })
      .getOne();

    if (!music) {
      throw new NotFoundException(`Can't find Music with id ${id}`);
    }

    return music;
  }

  async findMusicByPermalink(userId: string, permalink: string) {
    try {
      const music = await this.musicDetailQuery()
        .where('user.id = :userId', { userId })
        .andWhere('music.permalink = :permalink', { permalink })
        .getOne();

      if (!music) {
        throw new NotFoundException(
          `Can't find ${userId}'s music name: ${permalink}`,
        );
      }

      return music;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error to get music');
    }
  }

  async findMusicByIds(musicIds: number[]) {
    return this.musicSimpleQuery().whereInIds(musicIds).getMany();
  }

  async findRelatedMusic(id: number, musicPagingDto: PagingDto) {
    const music = await this.findMusicById(id);

    const { title, album, artist } = music;
    const { skip, take } = musicPagingDto;

    try {
      return this.musicSimpleQuery()
        .where('music.id != :id', { id: music.id })
        .andWhere(
          new Brackets((qb) => {
            let query = qb.where('music.title LIKE :title', {
              title: `%${title}%`,
            });
            if (album && album.length) {
              query = query.orWhere('music.album LIKE :album', {
                album: `%${album}%`,
              });
            }
            if (artist && artist.length) {
              query = query.orWhere(`music.artist LIKE :artist`, {
                artist: `%${artist}%`,
              });
            }
            return query;
          }),
        )
        .skip(skip)
        .take(take)
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `Error to get related musics`,
      );
    }
  }

  async findMusicsByUserId(userId: string, pagingDto: PagingDto) {
    const { skip, take } = pagingDto;
    return this.musicDetailQuery()
      .where('music.userId = :userId', { userId })
      .orderBy('music.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async findPopularMusicsByUserId(userId: string) {
    const minCount = 99;
    return this.musicDetailQuery()
      .where('music.userId = :userId', { userId })
      .andWhere((qb) => qb.where('music.count > :minCount', { minCount }))
      .orderBy('music.count', 'DESC')
      .take(10)
      .getMany();
  }

  async searchMusic(keyward: string, pagingDto: PagingDto) {
    const { skip, take } = pagingDto;

    try {
      return this.musicSimpleQuery()
        .where('LOWER(music.title) LIKE :title', {
          title: `%${keyward}%`,
        })
        .orderBy('music.count', 'DESC')
        .skip(skip)
        .take(take)
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException(error, `Error to search musics`);
    }
  }

  async getChartMusics(genre?: string[]) {
    const query = this.musicSimpleQuery()
      .where('music.genre IN (:genre)', {
        genre,
      })
      .orderBy('music.count', 'DESC');
  }

  // Update
  async updateMusic(music: Music) {
    try {
      await this.save(music);
      return music;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `Error to update music, music ID: ${music.id}`,
      );
    }
  }

  async updateMusicCount(id: number) {
    const music = await this.findMusicById(id);
    music.count += 1;
    return this.updateMusic(music);
  }

  async updateMusicData(id: number, updateMusicDataDto: UpdateMusicDataDto) {
    const music = await this.findMusicById(id);
    const entries = Object.entries(updateMusicDataDto);
    entries.forEach((entrie) => {
      const [key, value] = entrie;
      music[key] = value;
    });

    return this.updateMusic(music);
  }

  // Delete
  async deleteMusic(id: number, user: User): Promise<void> {
    try {
      const result = await this.delete({ id, user });
      if (result.affected === 0) {
        throw new NotFoundException(`Can't find Music with id ${id}`);
      }
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error to delete music');
    }
  }
}

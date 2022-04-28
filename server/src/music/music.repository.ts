import { User } from 'src/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { IMusicData, Music } from 'src/entities/music.entity';
import { EntityRepository, Repository } from 'typeorm';
import { EntityStatus } from 'src/entities/common.types';

@EntityRepository(Music)
export class MusicRepository extends Repository<Music> {
  async getAllMusic(): Promise<Music[]> {
    return this.find();
  }

  async createMusic(createMusicData: IMusicData, user: User): Promise<Music> {
    const { permalink } = createMusicData;

    const existMusics = await this.findOne({ permalink, user });

    const music = this.create({
      ...createMusicData,
      permalink: !existMusics ? permalink : `${permalink}_${Date.now()}`,
      user,
    });
    await this.save(music);

    return music;
  }

  async findMusicById(id: number): Promise<Music> {
    const music = await this.findOne(id);

    if (!music) {
      throw new NotFoundException(`Can't find Music with id ${id}`);
    }

    return music;
  }

  async findMusicByPermalink(userId: string, permalink: string) {
    const music = await this.findOne({ userId, permalink });

    if (!music) {
      throw new NotFoundException(
        `Can't find ${userId}'s music name: ${permalink}`,
      );
    }

    return music;
  }

  async deleteMusic(id: number, user: User): Promise<void> {
    const result = await this.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Music with id ${id}`);
    }
  }

  async updateMusicStatus(id: number, status: EntityStatus): Promise<Music> {
    const music = await this.findMusicById(id);

    music.status = status;
    await this.save(music);

    return music;
  }

  async updateMusicCount(id: number) {
    const music = await this.findMusicById(id);
    music.count += 1;
    await this.save(music);

    return music;
  }
}

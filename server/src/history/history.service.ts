import { CreateHistoryDto } from './dto/create-history.dto';
import { AuthService } from './../auth/auth.service';
import { HistoryRepository } from './history.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicRepository } from 'src/music/music.repository';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryRepository)
    private historytRepository: HistoryRepository,
    private musicRepository: MusicRepository,
    private authService: AuthService,
  ) {}

  async createHistory(createHistoryDto: CreateHistoryDto) {
    const { musicId, userId } = createHistoryDto;

    const user = await this.authService.findUserById(userId, true);
    const music = await this.musicRepository.findMusicById(musicId);

    return this.historytRepository.createHistory(user, music);
  }
}

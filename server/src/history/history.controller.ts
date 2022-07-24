import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Post('/create')
  async createHistory(
    @Body(ValidationPipe) createHistoryDto: CreateHistoryDto,
  ) {
    return this.historyService.createHistory(createHistoryDto);
  }
}

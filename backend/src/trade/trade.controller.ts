import { Controller, Get, Post, Body, Res, Param } from '@nestjs/common';
import { TradeService } from './trade.service';
import { CreateTradeDto } from './trade.dto';

@Controller('trades')
export class TradeController {
  constructor(private tradeService: TradeService) {}

  @Get()
  async getAllTrades(@Res() res) {
    const trades = await this.tradeService.findAll();
    return res.status(200).json(trades);
  }
  
  @Post()
  async createTrade(@Body() tradeDto: CreateTradeDto, @Res() res) {
    const trade = await this.tradeService.create(tradeDto);
    return res.status(201).json(trade);
  }
  
  @Get('/:userId')
  async getPortfolio(@Param('userId') userId: string, @Res() res) {
    const portfolio = await this.tradeService.calculatePortfolio(userId);
    return res.status(200).json(portfolio);
  }
}

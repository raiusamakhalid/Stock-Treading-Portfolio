import { Controller, Get, Post, Body, Res, Param } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './create-stock.dto';

@Controller('stocks')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get()
  async getAllStocks(@Res() res) {
    const stocks = await this.stockService.findAll();
    return res.status(200).json(stocks);
  }
  
  @Post()
  async createStock(@Body() stockDto: CreateStockDto, @Res() res) {
    const stock = await this.stockService.create(stockDto);
    return res.status(201).json(stock);
  }

  @Get('user/:userId')
  async getUserStocks(@Param('userId') userId: string) {
    return this.stockService.findUserStocks(userId);
  }
}

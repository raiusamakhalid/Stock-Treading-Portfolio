import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateStockDto } from './create-stock.dto';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.stock.findMany();
  }

  async create(stockDto: CreateStockDto) {
    return this.prisma.stock.create({ data: stockDto });
  }

  async findUserStocks(userId: string) {
    return this.prisma.trade.findMany({
      where: { userId, type: 'BUY' }, 
      include: { stock: true },
    });
  }

  async updateStockPrices() {
    const stocks = await this.prisma.stock.findMany();

    for (const stock of stocks) {
      const change = (Math.random() * 4 - 2).toFixed(2);
      const newPrice = Math.max(1, parseFloat((stock.price + parseFloat(change)).toFixed(2)));

      await this.prisma.stock.update({
        where: { id: stock.id },
        data: { price: newPrice },
      });
    }
  }

  onModuleInit() {
    setInterval(() => {
      this.updateStockPrices();
    }, 5000); // Runs every 5 seconds
  }
  
}
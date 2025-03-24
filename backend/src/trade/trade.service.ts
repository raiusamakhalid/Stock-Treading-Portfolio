import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTradeDto } from './trade.dto';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient(); 

@Injectable()
export class TradeService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.trade.findMany({ include: { stock: true, user: true } });
  }

  async create(tradeDto: CreateTradeDto) {

    // Check if stock exists
    const stockExists = await this.prisma.stock.findUnique({
        where: { id: tradeDto.stockId },
    });

    if (!stockExists) {
        throw new Error(`Stock with ID ${tradeDto.stockId} does not exist.`);
    }

    return this.prisma.trade.create({ data: tradeDto });
}

  async calculatePortfolio(userId: string) {
    const trades = await this.prisma.trade.findMany({
      where: { userId },
      include: { stock: true },
    });
  
    let totalInvestment = 0;
    let totalProfit = 0;
    const portfolio = {};
    let stock;
  
    for (const trade of trades) {
      const stockSymbol = trade.stock.symbol;
  
      if (!portfolio[stockSymbol]) {
        portfolio[stockSymbol] = { quantity: 0, investment: 0, profit: 0 };
      }

            // Fetch latest stock price from DB
      const latestStock = await this.prisma.stock.findUnique({
        where: { id: trade.stockId},
      });
  
      if (latestStock) {

        
          if (trade.type === 'BUY') {
            portfolio[stockSymbol].quantity += trade.quantity;

            portfolio[stockSymbol].investment += trade.quantity * trade.price;

          } else if (trade.type === 'SELL') {
            portfolio[stockSymbol].quantity -= trade.quantity; 
            portfolio[stockSymbol].investment -= trade.quantity * trade.price;

          }
          
          const avgBuyPrice = portfolio[stockSymbol].quantity > 0
          ? portfolio[stockSymbol].investment / portfolio[stockSymbol].quantity
          : 0;

          portfolio[stockSymbol].profit += trade.quantity * (latestStock?.price - avgBuyPrice);

      }
    }
  
    // Calculate total investment and profit for all stocks
    for (const stock in portfolio) {
      totalInvestment += portfolio[stock].investment;
  
      // Fetch latest stock price from DB
      const latestStock = await this.prisma.stock.findUnique({
        where: { symbol: stock },
      });
  
      if (latestStock) {
        const marketValue = portfolio[stock].quantity * latestStock.price;
        totalProfit += marketValue - portfolio[stock].investment;
      }
    }
  
    return { totalInvestment, totalProfit, portfolio };
  }
  
}

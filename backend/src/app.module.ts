import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { StockModule } from './stock/stock.module';
import { TradeModule } from './trade/trade.module';
import { UserService } from './user/user.service';
import { TradeService } from './trade/trade.service';
import { StockService } from './stock/stock.service';
import { UserController } from './user/user.controller';
import { TradeController } from './trade/trade.controller';
import { StockController } from './stock/stock.controller';

@Module({
  imports: [],
  controllers: [UserController,TradeController,StockController],
  providers: [PrismaService,UserService,TradeService,StockService],
})
export class AppModule {}

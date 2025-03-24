// trade.dto.ts
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TradeType } from '@prisma/client';

export class CreateTradeDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  stockId: string;

  @IsEnum(TradeType)
  type: TradeType;

  @IsInt()
  quantity: number;

  @IsNumber()
  price: number;
}

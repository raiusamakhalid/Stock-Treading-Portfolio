import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStockDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

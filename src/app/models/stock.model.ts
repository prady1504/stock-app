export interface Stock {
  symbol: string;
  name: string;
  price: number;
  high: number;
  low: number;
  high52: number;
  low52: number;
  isActive: boolean;
  lastPrice?: number;
  priceChangeFromPreviousClose?: number;
  changePercentage?: number;
}
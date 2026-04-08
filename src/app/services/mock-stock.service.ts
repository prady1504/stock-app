import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Stock } from '../models/stock.model';
import mockStockData from '../assets/data/mock-stock-data.json';
@Injectable({ providedIn: 'root' })
export class MockStockService {

  private initialStocks: Stock[] = mockStockData;
  private stocks = signal<Stock[]>(this.initialStocks);
   private intervalId: any;
  startUpdates() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.stocks.update(stocks =>
        stocks.map(stock => {
          if (!stock.isActive) return stock;

          const change = (Math.random() - 0.5) * 10;
          const newPrice = stock.price + change;

          return {
            ...stock,
            lastPrice: stock.price,
            price: newPrice,
            high: Math.max(stock.high, newPrice),
            low: Math.min(stock.low, newPrice)
          };
        })
      );
    }, 2000);
  }

  stopUpdates() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  updateStockStatus(symbol: string, isActive: boolean) {
    this.stocks.update(stocks =>
      stocks.map(stock => stock.symbol === symbol ? { ...stock, isActive } : stock)
    );
  }
  getStocks() {
    return this.stocks;
  }
}

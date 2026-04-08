import { computed, inject, Injectable } from '@angular/core';
import { MockStockService } from './mock-stock.service';
import { WebSocketService } from './websocket.service';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class StockService {
  private mockService = inject(MockStockService);
  private webSocketService = inject(WebSocketService);
  constructor() {
    if (environment.useMock) {
      this.mockService.startUpdates();
    } else {
      this.webSocketService.connect();
    }
  }
  private stocks = computed(() => {
    if (environment.useMock) {
      return this.mockService.getStocks()();
    } else {
      return this.webSocketService.getStocks()();
    }
  });

  getStocks() {
    return this.stocks;
  }

  disconnect() {
    this.webSocketService.disconnect();
  }

  sendToggle(symbol: string, isActive: boolean) {
    if (environment.useMock) {
      this.mockService.updateStockStatus(symbol, isActive);
    } else {
      this.webSocketService.sendToggle(symbol, isActive);
    }
  }
}
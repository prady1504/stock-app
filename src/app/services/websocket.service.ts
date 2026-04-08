import { Injectable, signal } from '@angular/core';
import { Stock } from '../models/stock.model';

@Injectable({ providedIn: 'root' })
export class WebSocketService {

  private socket!: WebSocket;
  private stocks = signal<Stock[]>([]);
  connect() {
    if (this.socket) return;
    this.socket = new WebSocket('ws://localhost:8080');
    this.socket.onopen = () => {
      console.log('Connected to WebSocket');
    };
    this.socket.onmessage = (event) => {
      const data: Stock[] = JSON.parse(event.data);
      this.stocks.set(data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket closed');
    };
  }
  getStocks() {
    return this.stocks;
  }
  sendToggle(symbol: string, isActive: boolean) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'TOGGLE',
        symbol,
        isActive
      }));
    }
  }
  disconnect() {
    this.socket?.close();
    this.socket = null as any;
  }
}
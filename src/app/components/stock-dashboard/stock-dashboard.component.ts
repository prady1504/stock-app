import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockService } from '../../services/stock.service';
import { StockCardComponent } from '../stock-card/stock-card.component';
import { MockStockService } from '../../services/mock-stock.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-stock-dashboard',
  standalone: true,
  imports: [CommonModule, StockCardComponent],
  templateUrl: './stock-dashboard.component.html',
  styleUrls: ['./stock-dashboard.component.scss']
})
export class StockDashboardComponent implements OnDestroy {

  private stockService = inject(StockService);
  // private mockService = inject(MockStockService);
  private stocksData = this.stockService.getStocks();
  toggleState = signal<Record<string, boolean>>({});
  stocks = computed(() =>
    this.stocksData().map(stock => ({
      ...stock,
      isActive: this.toggleState()[stock.symbol] ?? true
    }))
  );
  toggleStock(event: { symbol: string; value: boolean }) {
    this.toggleState.update(state => ({
      ...state,
      [event.symbol]: event.value
    }));

    this.stockService.sendToggle(event.symbol, event.value);
  }
  ngOnDestroy() {
    this.stockService.disconnect();
  }
}
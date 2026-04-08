import { Component, input, computed, output } from '@angular/core';
import { Stock } from '../../models/stock.model';
import { CommonModule } from '@angular/common';
import { ToggleComponent } from '../../shared/components/toggle/toggle.component';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  imports: [CommonModule, ToggleComponent],
  templateUrl: './stock-card.component.html',
  styleUrl: './stock-card.component.scss'
})
export class StockCardComponent {
  stock = input.required<Stock>();
  toggle = output<{ symbol: string; value: boolean }>();
  cardClass = computed(() => {
    const s = this.stock();

    if (!s.isActive) return 'gray';
    if (s.lastPrice === undefined) return '';

    return s.price < s.lastPrice ? 'red' : 'green';
  });
    onToggle(value: boolean) {
    this.toggle.emit({ symbol: this.stock().symbol, value });
  }
}

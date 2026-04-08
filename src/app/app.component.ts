import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StockDashboardComponent } from './components/stock-dashboard/stock-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StockDashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'stock-app';
}

import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss'
})
export class ToggleComponent {
  isOn = input(false);
  toggled = output<boolean>();
  toggle() {
    const newValue = !this.isOn();
    this.toggled.emit(newValue);
  }
}

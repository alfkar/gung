import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  items: { name: string, id: number, price: number }[] = [];

  constructor() {
    // Sample list of items with name, id, and price properties
    this.items = [
      { name: 'Product 1', id: 1, price: 10.99 },
      { name: 'Product 2', id: 2, price: 19.99 },
      { name: 'Product 3', id: 3, price: 25.49 },
      { name: 'Product 4', id: 4, price: 15.79 },
      { name: 'Product 5', id: 5, price: 8.99 }
    ];
  }
}

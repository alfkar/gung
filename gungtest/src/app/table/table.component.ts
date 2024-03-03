import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  imports: [CommonModule]
})
export class TableComponent implements OnInit {
  @Input() products: Product[] = []; // Receive the products array from the parent

  constructor() {}

  ngOnInit() {
    // Use the received products array in the child component
    console.log('Received products:', this.products);
  }
}

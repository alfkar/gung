import { Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ProductWithCategory } from '../app.component';

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule, ScrollingModule, CdkVirtualScrollViewport]
})
export class TableComponent implements OnInit {
  @Input() products: ProductWithCategory[] = []; // Receive the products array from the parent
  defaultState: ProductWithCategory[] = [];
  sortingState: 'ascending' | 'descending' | 'neutral' = 'neutral';  
  constructor() {}

  ngOnInit() {
    // Use the received products array in the child component
    this.defaultState = [...this.products];
    console.log('Received products:', this.products);
  }
  sortProductsByVolume() {
    switch (this.sortingState) {
      case 'ascending':
        this.sortingState = 'descending';
        this.products.sort((a, b) => b.extra.AGA.VOL - a.extra.AGA.VOL);
        break;
      case 'descending':
        this.sortingState = 'neutral';
        this.products = [...this.defaultState];
        break;
      default:
        this.sortingState = 'ascending';
        this.products.sort((a, b) => a.extra.AGA.VOL - b.extra.AGA.VOL);
        break;
    }
    this.products = [...this.products];
    console.log("Products sorted by volume:", this.products);
  }
}

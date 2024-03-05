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

  constructor() {}

  ngOnInit() {
    // Use the received products array in the child component
    console.log('Received products:', this.products);
  }
  sortProductsByVolume() {
    this.products.sort((a, b) => {
      if (a.extra.AGA.VOL< b.extra.AGA.VOL) return -1;
      if (a.extra.AGA.VOL > b.extra.AGA.VOL) return 1;
      return 0;
    });
    console.log("Products should be sorted");
    console.log(this.products);
  }
}

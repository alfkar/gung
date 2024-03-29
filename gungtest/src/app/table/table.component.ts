import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ProductWithCategory } from '../app.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import {MatSliderModule} from '@angular/material/slider';
@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule, ScrollingModule, CdkVirtualScrollViewport, MatProgressSpinnerModule, FormsModule, MatSliderModule]
})

export class TableComponent implements OnInit {
  @Input() products: ProductWithCategory[] = [];
  defaultState: ProductWithCategory[] = [];
  sortingCachedState: ProductWithCategory[] = [];
  sortingStates: { [key: string]: 'ascending' | 'descending' | 'neutral' } = {};
  categoryFilter: string = '';
  nameFilter: string = '';
  idFilter: string = '';
  priceFilter: number | null = null;
  showOnlyInStock: boolean = false;
  showPopup: boolean = false;
  lowerBound: number | null = null;
  upperBound: number | null = null;
  aLotOfData: boolean = false;
  threshold: number = 5100;
  constructor() {}

  ngOnInit() {
    this.defaultState = [...this.products];
    console.log('Received products:', this.products);
    this.initializeSortingStates(); // Initialize sorting states
    if(this.defaultState.length >= this.threshold){
      this.aLotOfData = true;
    }
  }

  togglePopup(event: Event) {
    event.stopPropagation(); // Stop the propagation of the click event
    this.showPopup = !this.showPopup;
  }
  /*
  Helper methods to stop button events affecting each other
  */
  filterButton(event: Event){
    event.stopPropagation();
    this.applyFilters();
  }
  /*
  Clears all filters and sorting states at once.
  */
  clearFilters(event: Event){
    event.stopPropagation();
    this.initializeSortingStates();
    this.categoryFilter = '';
    this.nameFilter = '';
    this.idFilter = '';
    this.priceFilter = null;
    this.showOnlyInStock = false;
    this.showPopup = false;
    this.lowerBound = null;
    this.upperBound = null;
    this.applyFilters();
  }
  onKeyDown(event: KeyboardEvent) {
    console.log("PressedKey: {}",event.key);
    if (event.key === 'Enter') { 
      this.applyFilters(); 
    }
  }
  initializeSortingStates() {
    this.sortingStates['volume'] = 'neutral'; 
    this.sortingStates['stock'] = 'neutral'; 
    this.sortingStates['category'] = 'neutral';
  }
  /* 
  Applying all active filters at once.
  Each filter has a helper method to that check filter conditions.
  */
  applyFilters() {
    let filteredProducts = this.defaultState.slice(); 
    filteredProducts = filteredProducts.filter(product =>
      this.filterInStock(product) &&
      this.filterByVolume(product, this.lowerBound, this.upperBound) &&
      this.filterByName(product, this.nameFilter) &&
      this.filterByCategory(product, this.categoryFilter) &&
      this.filterById(product, this.idFilter) &&
      this.filterByPrice(product, this.priceFilter)
    );
    this.products = filteredProducts;
  }
/*
* Helper methods for applying filters. 
*/
  filterInStock(product: ProductWithCategory): boolean {
    return !this.showOnlyInStock || (product.extra && product.extra.AGA && Number(product.extra.AGA.LGA) > 0);
  }

  filterByVolume(product: ProductWithCategory, lowerBound: number | null, upperBound: number | null): boolean {
    lowerBound = lowerBound !== null ? lowerBound : 0;
    upperBound = upperBound !== null ? upperBound : Number.MAX_VALUE;

    return product.extra && product.extra.AGA && product.extra.AGA.VOL &&
        Number(product.extra.AGA.VOL) >= lowerBound && Number(product.extra.AGA.VOL) <= upperBound;
  }


  filterByName(product: ProductWithCategory, name: string): boolean {
    return !name || product.name.toLowerCase().includes(name.toLowerCase());
  }


  filterByCategory(product: ProductWithCategory, category: string): boolean {
    if (!category) {
      return true;
    } else {
      return (product.categoryName && product.categoryName.toLowerCase().includes(category.toLowerCase())) || false;
    }
  }

  filterById(product: ProductWithCategory, id: string): boolean {
    return !id || product.id.toLowerCase().includes(id.toLowerCase());
  }

  filterByPrice(product: ProductWithCategory, price: number | null): boolean {
    return price === null ? true : (product.extra && product.extra.AGA && product.extra.AGA.PRI && Number(product.extra.AGA.PRI) >= price);
}
  toggleInStockFilter(){
    this.showOnlyInStock = !this.showOnlyInStock;
    this.applyFilters();
  }
  /*
  Sorting method for Volume, Stock and Category
  Uses a caching state to reset to incase the user sorts another field.
  */
  sortProductsByVolume() {
    this.resetStates('volume');
    switch (this.sortingStates['volume']) {
      case 'ascending':
        this.sortingStates['volume'] = 'descending';
        this.products.sort((a, b) => b.extra.AGA.VOL - a.extra.AGA.VOL);
        break;
      case 'descending':
        this.sortingStates['volume'] = 'neutral';
        this.products = [...this.sortingCachedState];
        break;
      default:
        this.sortingCachedState = [...this.products]
        this.sortingStates['volume'] = 'ascending';
        this.products.sort((a, b) => a.extra.AGA.VOL - b.extra.AGA.VOL);
        break;
    }
    this.products = [...this.products];
  }

  sortProductsByStock() {
    this.resetStates('stock');
    switch (this.sortingStates['stock']) {
      case 'ascending':
        this.sortingStates['stock'] = 'descending';
        this.products.sort((a, b) => b.extra.AGA.LGA - a.extra.AGA.LGA);
        break;
      case 'descending':
        this.sortingStates['stock'] = 'neutral';
        this.products = [...this.sortingCachedState];
        break;
      default:
        this.sortingCachedState = [...this.products]
        this.sortingStates['stock'] = 'ascending';
        this.products.sort((a, b) => a.extra.AGA.LGA - b.extra.AGA.LGA);
        break;
    }
    this.products = [...this.products];
  }

  sortProductsByCategory() {
    this.resetStates('category');
    switch (this.sortingStates['category']) {
      case 'ascending':
        this.sortingStates['category'] = 'descending';
        this.products.sort((a, b) => (a.categoryName && b.categoryName) ? a.categoryName.localeCompare(b.categoryName) : 0);
        break;
      case 'descending':
        this.sortingStates['category'] = 'neutral';
        this.products = [...this.sortingCachedState];
        break;
      default:
        this.sortingCachedState = [...this.products]
        this.sortingStates['category'] = 'ascending';
        this.products.sort((a, b) => (a.categoryName && b.categoryName) ? b.categoryName.localeCompare(a.categoryName) : 0);
        break;
    }
    this.products = [...this.products];
  }
  resetStates(sortingType: string) {
    for (const key in this.sortingStates) {
      if (key !== sortingType) {
        this.sortingStates[key] = 'neutral';
      }
    }
  }
}


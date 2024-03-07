import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ProductWithCategory } from '../app.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule, ScrollingModule, CdkVirtualScrollViewport, MatProgressSpinnerModule, FormsModule]
})

export class TableComponent implements OnInit {
  @Input() products: ProductWithCategory[] = [];
  defaultState: ProductWithCategory[] = [];
  sortingCachedState: ProductWithCategory[] = [];
  sortingStates: { [key: string]: 'ascending' | 'descending' | 'neutral' } = {};
  categoryFilter: string = '';
  nameFilter: string = '';
  idFilter: string = '';
  priceFilter: number;
  showOnlyInStock: boolean = false;
  constructor() {}

  ngOnInit() {
    this.defaultState = [...this.products];
    console.log('Received products:', this.products);
    this.initializeSortingStates(); // Initialize sorting states
  }

  initializeSortingStates() {
    this.sortingStates['volume'] = 'neutral'; // Initialize volume sorting state
    this.sortingStates['stock'] = 'neutral'; // Initialize stock sorting state
    this.sortingStates['category'] = 'neutral';
  }
  applyFilters(name: string, category: string, id: string, price: number) {
    if(!name && !category && !id && !price && !this.showOnlyInStock){
      this.products = [...this.defaultState];
      return;
    }
    let filteredByName = this.filterByName(name);
    let filteredByCategory = this.filterByCategory(category);
    let filteredById = this.filterById(id);
    let filteredByPrice = this.filterByPrice(price);
    let filteredByStock = this.filterInStock();
    // Intersect filtered arrays to get the final result
    this.products= this.intersectArrays(filteredByName, filteredByCategory, filteredById, filteredByPrice, filteredByStock);
  }
  filterInStock(): ProductWithCategory[]{
    if(!this.showOnlyInStock) return this.defaultState;
    return this.defaultState.filter(product =>
    product.extra && product.extra.AGA && Number(product.extra.AGA.LGA) > 0
    );
  }
  toggleInStockFilter(){
    this.showOnlyInStock = !this.showOnlyInStock;
    this.applyFilters(this.nameFilter, this.categoryFilter, this.idFilter, this.priceFilter);
  }

  filterByName(name: string): ProductWithCategory[] {
    if (!name) return this.defaultState; // If volume is empty, return all products
    return this.defaultState.filter(product =>
      product.name.toString().toLowerCase().includes(name.toLowerCase())
    );
  }
  filterByCategory(category: string): ProductWithCategory[] {
    if (!category) return this.defaultState; // If category is empty, return all products
    return this.defaultState.filter(product =>
      product.categoryName && product.categoryName.toLowerCase().includes(category.toLowerCase())
    );
  }
  filterById(id: string): ProductWithCategory[] {
    if (!id) return this.defaultState; // If category is empty, return all products
    return this.defaultState.filter(product =>
      product.id.toLowerCase().includes(id.toLowerCase())
    );
  }
  filterByPrice(price: number): ProductWithCategory[] {
    if (!price) return this.defaultState; // If price is empty, return all products
    return this.defaultState.filter(product =>
      product.extra && product.extra.AGA && product.extra.AGA.PRI && Number(product.extra.AGA.PRI) >= price
    );
  }
  intersectArrays(...arrays: ProductWithCategory[][]): ProductWithCategory[] {
    // Intersect arrays to get the common elements
    if (arrays.length === 0) return [];
    if (arrays.length === 1) return arrays[0];
    return arrays.reduce((previous, current) =>
      previous.filter(element => current.includes(element))
    );
  }

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

  resetAllStates() {
    for (const key in this.sortingStates) {
      this.sortingStates[key] = 'neutral';
    }
  }
}


import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableComponent } from './table/table.component';
import { Product, ProductService } from './product.service';
import { Observable, forkJoin } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ProductService]
})
export class AppComponent implements OnInit{
  title = 'gungtest';
  products: Observable<Product[]>;
  numberOfRandomProducts = 5; 
  constructor(private productService:ProductService){

  }
  ngOnInit() {
    // Call getRandomProduct() multiple times and combine the results into an array
    const randomProductObservables: Observable<Product>[] = [];
    for (let i = 0; i < this.numberOfRandomProducts; i++) {
      randomProductObservables.push(this.productService.getRandomProduct('someId')); // Pass a sample id
    }

    // Combine multiple observables into one observable array
    this.products = forkJoin(randomProductObservables);
  }
}

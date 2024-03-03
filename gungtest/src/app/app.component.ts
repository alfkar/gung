import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from './product.service';
import { Observable, forkJoin } from 'rxjs';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ProductService],
  imports: [TableComponent]
})
export class AppComponent implements OnInit {
  title = 'gungtest';
  products: Product[] = []; // Initialize products as an empty array
  id = "";
  numberOfRandomProducts = 5;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    const randomProductObservables: Observable<Product>[] = [];
    for (let i = 0; i < this.numberOfRandomProducts; i++) {
      this.id = "" + i;
      randomProductObservables.push(this.productService.getRandomProduct(this.id));
    }

    forkJoin(randomProductObservables)
      .subscribe((products: Product[]) => {
        this.products = products; // Assign the array of products
      });
  }

}


import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from './product.service';
import { CategoryService, Category } from './category.service';
import { Observable, forkJoin } from 'rxjs';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ProductService,CategoryService],
  imports: [TableComponent]
})
export class AppComponent implements OnInit {
  title = 'gungtest';
  prod: ProductWithCategory;
  products: ProductWithCategory[] = []; // Initialize products as an empty array
  categories: Observable<Category>;
  id = "";
  numberOfRandomProducts = 5;

  constructor(private productService: ProductService, private categoryService: CategoryService) {
    this.categories = this.categoryService.getCategories();
  }
  ngOnInit() {
    this.categories.subscribe(categories => {
      this.flattenProducts(categories, []);
    });
  }
  flattenProducts(category: Category, parentCategory: string[] = []) {
    if(category.id.charAt(0) == 's'){
      if(category.children.length > 0){
        category.children.forEach(child => {
        this.flattenProducts(child, parentCategory.concat([category.id]));
      })
      }
    }
    else{
    this.productService.getProduct(category.id).subscribe(product => {
        this.prod = { ...product, category: parentCategory }; // Initialize this.prod before assigning values
        this.products.push(this.prod);
        console.log(this.prod.category)
      });    
    }
  }
}
export interface ProductWithCategory extends Product{
  category?: string[];
}

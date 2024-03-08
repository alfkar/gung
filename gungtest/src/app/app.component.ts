import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from './product.service';
import { CategoryService, Category } from './category.service';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable, forkJoin } from 'rxjs';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ProductService,CategoryService,ScrollingModule, CdkVirtualScrollViewport],
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
    //this.categories = this.categoryService.getAlotOfCategories();
  }
  ngOnInit() {
    this.categories.subscribe(categories => {
      this.flattenProducts(categories, [], "");
    });
  }
  flattenProducts(category: Category, parentCategory: string[] = [], categoryNames: string) {
    if(category.id.charAt(0) == 's'){
      if(category.children.length > 0){
        category.children.forEach(child => {
        this.flattenProducts(child, parentCategory.concat([category.id]), categoryNames + " " + category.name);
      })
      }
    }
    else{
    this.productService.getProduct(category.id).subscribe(product => {
        if (product != null){
          this.prod = { ...product, categoryId: parentCategory,categoryName: categoryNames };
          this.products.push(this.prod);
          this.products.push(this.prod);
          this.products.push(this.prod);
          this.products.push(this.prod);
        }
        else{
          this.prod = {
            id: "0",
            name: "TestName",
            extra: {"AGA": {"APE": "      1","KAT": "TU","LGA": "       1.00","PRI": "    4875.00","TYP": "","VOL": "    5.300","VPE": "    0.000","XP1": "          0","XP2": "          0"}},
            categoryId: parentCategory,
            categoryName: categoryNames
          }
          this.products.push(this.prod);
        }
      });
    }
  }
}
export interface ProductWithCategory extends Product{
  categoryId?: string[];
  categoryName?: string;
}

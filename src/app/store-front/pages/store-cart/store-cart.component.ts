import { Product } from '@/products/interfaces/product.interface';
import { ProductsService } from '@/products/services/products.service';
import { Component, inject, signal, OnChanges } from '@angular/core';
import { ProductCardComponent } from "../../../products/components/product-card/product-card.component";
import { ProductInCartComponent } from "../../../products/components/product-in-cart/product-in-cart.component";

@Component({
  selector: 'store-cart',
  imports: [ ProductInCartComponent],
  templateUrl: './store-cart.component.html',
})
export class StoreCartComponent {
  productService = inject(ProductsService);

  userCart=signal<Product[]>([]);


   ngOnInit() {
  this.userCart.set(this.productService.loadCart());
}

}

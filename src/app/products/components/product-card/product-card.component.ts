import { Product } from '@/products/interfaces/product.interface';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';
import { ProductsService } from '@/products/services/products.service';
import { SlicePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {

  productService = inject(ProductsService);

  product = input.required<Product>();

  imageUrl = computed(() => {
    return `http://localhost:3000/api/files/product/${this.product().images[0]}`
  })


}

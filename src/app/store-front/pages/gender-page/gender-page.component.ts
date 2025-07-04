import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { ProductsService } from '@/products/services/products.service';
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";

@Component({
  selector: 'gender-page',
  imports: [ProductCardComponent, UpperCasePipe, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  route = inject(ActivatedRoute);
  paginationService = inject(PaginationService);

  gender = toSignal(
    this.route.params.pipe(
      map(({gender}) => gender)
    )
  )

  productsService = inject(ProductsService);

  productsResource = rxResource({
    request: () => ({gender: this.gender(),page: this.paginationService.currentPage()-1}),
    loader: ({request},)=> {
      return this.productsService.getProducts({
        gender: request.gender,
        offset: request.page *12
      });
    }
  })
}

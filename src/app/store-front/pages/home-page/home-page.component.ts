import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { ProductsService } from '@/products/services/products.service';
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { PaginationComponent } from "@shared/components/pagination/pagination.component";


@Component({
  selector: 'home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  // activatedRoute = inject(ActivatedRoute);

  // currentPage = toSignal(
  //   this.activatedRoute.queryParamMap.pipe(
  //     map(params => (params.get('page') ? +params.get('page')! : 1 ) ),
  //     map(page => (isNaN(page) ? 1 : page)),
  //   ),
  //   {
  //       initialValue: 1
  //     },
  // );

  productsResource = rxResource({
    request: () => ({page: this.paginationService.currentPage()-1}),
    loader: ({request})=> {
      return this.productsService.getProducts({
        offset: request.page * 12,
      });
    }
  })

}


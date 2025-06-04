import { User } from '@/auth/interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, of, tap, map, forkJoin, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options{
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({providedIn: 'root'})
export class ProductsService {

  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  userCart=signal<Product[]>([]);

  getProducts(options: Options): Observable<ProductsResponse>{

    const {limit = 12, offset=0, gender = ''} = options;

    const key = `${limit}-${offset}-${gender}`;

    if(this.productsCache.has(key)){
      return of(this.productsCache.get(key)!);
    };

    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit: limit,
        offset: offset,
        gender: gender,
      }
    })
    .pipe(

      tap((resp) => console.log({resp})),
      tap((resp) => this.productsCache.set(key,resp)),

    )
  };

  getProductByIdSlug( idSlug: string): Observable<Product>{

    const key =idSlug;

    if(this.productCache.has(key)){
      return of(this.productCache.get(key)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
      tap((resp) => this.productCache.set(key,resp)),
    );
  };

  getProductById( id: string): Observable<Product>{

    if(id === 'new'){
      return of(emptyProduct);
    }

    const key =id;

    if(this.productCache.has(key)){
      return of(this.productCache.get(key)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      tap((resp) => this.productCache.set(key,resp)),
    );
  };

  updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product>{

    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map((imageNames) => ({
        ...productLike,
        images: [...currentImages, ...imageNames],
      })),
      switchMap((updatedProduct) =>
        this.http.patch<Product>(`${baseUrl}/products/${id}`,updatedProduct)
      ),
      tap((product) => this.updateCache(product))
    );


    // return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
    // .pipe(
    //   tap((product) => this.updateCache(product))
    // )
  };

  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product>{
    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map((imageNames) => ({
        ...productLike,
        images: [...imageNames],
      })),
      switchMap((updatedProduct) =>
       this.http.post<Product>(`${baseUrl}/products`,updatedProduct)
      ),
      tap((product) => this.updateCache(product))
    );
  };

  updateCache(product: Product){
    const productId = product.id;

    this.productCache.set(productId,product);

    this.productsCache.forEach(productResponse => {
      productResponse.products = productResponse.products.map(
        (currentProduct) => currentProduct.id === productId ? product : currentProduct
      );
    });
  };

  saveCart(){
    localStorage.setItem('cart',JSON.stringify(this.userCart()));
  }

  loadCart(): Product[] {
  const storedCart = localStorage.getItem('cart');
  const productsInStorage: Product[] = storedCart ? JSON.parse(storedCart) : [];
  this.userCart.set(productsInStorage);

  return this.userCart();
}



  addToCart(product: Product) {
    this.userCart.update(products => [...products, product]);
    this.saveCart();
  }

  deleteFromCart(product: Product){
    this.userCart.update(products => products.filter(p => p.id !== product.id));
    this.saveCart();
    this.userCart.set(this.loadCart());
    window.location.reload();
  }

  deleteProduct(id: string){
    return this.http.delete(`${baseUrl}/products/${id}`);
  }

  uploadImages(images?: FileList): Observable<string[]>{
    if(!images) return of([]);

    const uploadObservables = Array.from(images).map((imageFile) =>
      this.uploadImage(imageFile)
    );

    return forkJoin(uploadObservables);
};

  uploadImage(imageFile : File): Observable<string> {
    const formData = new FormData();
    formData.append('file',imageFile);

    return this.http.post<{fileName: string}>(`${baseUrl}/files/product`, formData)
      .pipe(
        map(resp => resp.fileName)
      )
  }


}

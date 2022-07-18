import 'reflect-metadata';

import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

import { IoCTypes } from 'ioc';
import type { Product } from 'models';
import type { ProductsService } from 'services';

@injectable()
export default class ProductsStore {
  @inject(IoCTypes.productsService)
  private readonly productsService!: ProductsService;

  isLoading = false;
  products: Product[] = [];
  product: Product | undefined = undefined;
  totalPages = 0;
  currentPage = 1;
  pageLimit = 6;

  constructor() {
    const urlParameters = new URLSearchParams(window.location.search);
    const page = urlParameters.get('page');
    const limit = urlParameters.get('limit');
    this.currentPage = Number(page);
    this.pageLimit = Number(limit);
    this.isLoading = false;
    makeAutoObservable(this);
  }

  public getById = async (id: number): Promise<Product | undefined> => {
    this.isLoading = true;
    this.product = undefined;

    try {
      const result = await this.productsService.getById(id);
      this.product = { ...result };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }

    this.isLoading = false;

    return this.product;
  };

  public getItems = async (): Promise<void> => {
    this.isLoading = true;
    const urlParameters = new URLSearchParams(window.location.search);
    const page = urlParameters.get('page');
    const limit = urlParameters.get('limit');
    this.product = undefined;
    this.currentPage = page ? Number(page) : Number(1);
    this.pageLimit = limit ? Number(limit) : Number(6);

    try {
      const result = await this.productsService.getItems({
        pageIndex: Number(this.currentPage) - 1, // numeration of pages starts from 0 on server
        pageSize: Number(this.pageLimit),
        brandIdFilter: 0,
        typeIdFilter: 0,
      });
      this.products = result.data;
      this.totalPages = result.total_pages;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }

    this.isLoading = false;
  };

  public changePage = (page: number): void => {
    this.currentPage = page;
  };
}

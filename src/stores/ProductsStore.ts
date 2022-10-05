import 'reflect-metadata';

import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

import { IoCTypes } from 'ioc';
import type { Brand, Product, Type } from 'models';
import type { ProductsService } from 'services';

@injectable()
export default class ProductsStore {
  @inject(IoCTypes.productsService)
  private readonly productsService!: ProductsService;

  public currentPage = 1;
  public pageLimit = 6;
  public totalPages = 0;
  public brands: Brand[] = [];
  public types: Type[] = [];
  public selectedBrandId = 0;
  public selectedTypeId = 0;
  public products: Product[] = [];
  public lastState = '';
  public isLoading = false;

  constructor() {
    const urlParameters = new URLSearchParams(window.location.search);
    const page = urlParameters.get('page');
    const limit = urlParameters.get('limit');
    const brand = urlParameters.get('brand');
    const type = urlParameters.get('type');
    this.currentPage = Number(page);
    this.pageLimit = Number(limit);
    this.totalPages = 0;
    this.brands = [];
    this.types = [];
    this.selectedBrandId = Number(brand);
    this.selectedTypeId = Number(type);
    this.products = [];
    this.lastState = '';
    this.isLoading = false;
    makeAutoObservable(this);
  }

  public getBrands = async (): Promise<void> => {
    try {
      this.brands = await this.productsService.getBrands();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.log(error);
      }
    }
  };

  public getTypes = async (): Promise<void> => {
    try {
      this.types = await this.productsService.getTypes();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.log(error);
      }
    }
  };

  public getItems = async (state?: string): Promise<void> => {
    if (this.products.length > 0 && state === this.lastState) {
      return;
    }

    this.isLoading = true;
    const urlParameters = new URLSearchParams(window.location.search);
    const page = urlParameters.get('page');
    const limit = urlParameters.get('limit');
    const brand = urlParameters.get('brand');
    const type = urlParameters.get('type');
    this.currentPage = page ? Number(page) : Number(1);
    this.pageLimit = limit ? Number(limit) : Number(6);
    this.selectedBrandId = brand ? Number(brand) : Number(0);
    this.selectedTypeId = type ? Number(type) : Number(0);

    try {
      if (this.brands.length === 0) {
        await this.getBrands();
      }

      if (this.types.length === 0) {
        await this.getTypes();
      }

      const result = await this.productsService.getItems({
        pageIndex: Number(this.currentPage) - 1, // numeration of pages starts from 0 on server
        pageSize: Number(this.pageLimit),
        brandIdFilter: Number(this.selectedBrandId) ?? 0,
        typeIdFilter: Number(this.selectedTypeId) ?? 0,
      });

      this.products = result.data;
      this.totalPages = result.total_pages;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.log(error);
      }
    }

    this.isLoading = false;
    this.lastState = state ?? '';
  };

  public changePage = (page: number): void => {
    this.currentPage = page;
  };

  public changeBrandId = (brand: number): void => {
    this.selectedBrandId = brand;
  };

  public changeTypeId = (type: number): void => {
    this.selectedTypeId = type;
  };
}

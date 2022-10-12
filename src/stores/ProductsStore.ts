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
  public selectedBrandIds: number[] = [];
  public selectedTypeIds: number[] = [];
  public products: Product[] = [];
  public lastState: string | undefined = undefined;
  public isLoading = false;

  constructor() {
    const urlParameters = new URLSearchParams(window.location.search);
    const page = urlParameters.get('page');
    const limit = urlParameters.get('limit');
    this.currentPage = Number(page);
    this.pageLimit = Number(limit);
    this.totalPages = 0;
    this.brands = [];
    this.types = [];
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
    if (state === this.lastState) {
      return;
    }

    if (this.brands.length === 0) {
      await this.getBrands();
    }

    if (this.types.length === 0) {
      await this.getTypes();
    }

    this.isLoading = true;
    const urlParameters = new URLSearchParams(window.location.search);
    const page = urlParameters.get('page');
    const limit = urlParameters.get('limit');
    const brands = urlParameters.get('brands');
    const types = urlParameters.get('types');
    this.currentPage = page ? Number(page) : Number(1);
    this.pageLimit = limit ? Number(limit) : Number(6);

    const selectedBrandIdsTemp = brands ? brands.split(',').map(Number) : [];
    const selectedTypeIdsTemp = types ? types.split(',').map(Number) : [];
    this.selectedBrandIds = selectedBrandIdsTemp.filter((id) => this.brands.map((brand) => brand.id).includes(id));
    this.selectedTypeIds = selectedTypeIdsTemp.filter((id) => this.types.map((type) => type.id).includes(id));

    try {
      const result = await this.productsService.getItems({
        pageIndex: Number(this.currentPage) - 1, // numeration of pages starts from 0 on server
        pageSize: Number(this.pageLimit),
        brandIdFilter: this.selectedBrandIds ?? [],
        typeIdFilter: this.selectedTypeIds ?? [],
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
    this.lastState = state ?? undefined;
  };

  public changePage = (page: number): void => {
    this.currentPage = page;
  };

  public changeBrandIds = (brand: number[]): void => {
    this.selectedBrandIds = brand;
  };

  public changeTypeIds = (type: number[]): void => {
    this.selectedTypeIds = type;
  };
}

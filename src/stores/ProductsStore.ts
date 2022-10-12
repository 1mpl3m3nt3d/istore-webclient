import 'reflect-metadata';

import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

import { IoCTypes } from 'ioc';
import type { Brand, Product, Type } from 'models';
import type { ProductsService } from 'services';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 4;

@injectable()
export default class ProductsStore {
  @inject(IoCTypes.productsService)
  private readonly productsService!: ProductsService;

  public currentPage = DEFAULT_PAGE;
  public pageLimit = DEFAULT_LIMIT;
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
    this.currentPage = page ? Number.parseInt(page) : DEFAULT_PAGE;
    this.pageLimit = limit ? Number.parseInt(limit) : DEFAULT_LIMIT;
    this.totalPages = 0;
    this.brands = [];
    this.types = [];
    this.products = [];
    this.lastState = '';
    this.isLoading = true;
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

    try {
      const urlParameters = new URLSearchParams(window.location.search);
      const page = urlParameters.get('page');
      const limit = urlParameters.get('limit');
      const brands = urlParameters.get('brands');
      const types = urlParameters.get('types');

      this.currentPage = page ? Number.parseInt(page) : DEFAULT_PAGE;
      this.pageLimit = limit ? Number.parseInt(limit) : DEFAULT_LIMIT;

      const selectedBrandIdsTemp = brands ? brands.split(',').map(Number) : [];
      const selectedTypeIdsTemp = types ? types.split(',').map(Number) : [];

      this.selectedBrandIds = selectedBrandIdsTemp.filter((id) => this.brands.map((brand) => brand.id).includes(id));
      this.selectedTypeIds = selectedTypeIdsTemp.filter((id) => this.types.map((type) => type.id).includes(id));

      const result = await this.productsService.getItems({
        pageIndex: this.currentPage - 1, // numeration of pages starts from 0 on server
        pageSize: this.pageLimit,
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

  public changeLimit = (limit: number): void => {
    this.pageLimit = limit;
  };

  public changeBrandIds = (brand: number[]): void => {
    this.selectedBrandIds = brand;
  };

  public changeTypeIds = (type: number[]): void => {
    this.selectedTypeIds = type;
  };
}

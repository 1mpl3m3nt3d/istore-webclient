import 'reflect-metadata';

import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

import { IoCTypes } from 'ioc';
import type { Brand, Product, Type } from 'models';
import type { ProductsService } from 'services';

const DEFAULT_IDS: number[] = [];
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 4;

@injectable()
export default class ProductsStore {
  @inject(IoCTypes.productsService)
  private readonly productsService!: ProductsService;

  public currentPage = DEFAULT_PAGE;
  public pageLimit = DEFAULT_LIMIT;
  public totalPages = 0;
  public products: Product[] = [];
  public brands: Brand[] = [];
  public types: Type[] = [];
  public selectedBrandIds: number[] = [];
  public selectedTypeIds: number[] = [];
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
    this.isLoading = true;
    makeAutoObservable(this);
  }

  public getBrands = async (): Promise<void> => {
    try {
      if (this.brands.length === 0) {
        this.brands = await this.productsService.getBrands();
      }
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
      if (this.types.length === 0) {
        this.types = await this.productsService.getTypes();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.log(error);
      }
    }
  };

  public getItems = async (): Promise<void> => {
    this.isLoading = true;

    if (this.brands.length === 0) {
      await this.getBrands();
    }

    if (this.types.length === 0) {
      await this.getTypes();
    }

    try {
      const urlParameters = new URLSearchParams(window.location.search);
      const page = urlParameters.get('page');
      const limit = urlParameters.get('limit');
      const brands = urlParameters.get('brands');
      const types = urlParameters.get('types');

      if (page) {
        this.currentPage = page ? Number.parseInt(page) : DEFAULT_PAGE;
      } else {
        this.currentPage = DEFAULT_PAGE;
      }

      if (limit) {
        this.pageLimit = limit ? Number.parseInt(limit) : DEFAULT_LIMIT;
      } else {
        this.pageLimit = DEFAULT_LIMIT;
      }

      if (brands) {
        const selectedBrandIdsTemp = brands ? brands.split(',').map(Number) : DEFAULT_IDS;
        const selectedBrandIdsChecked = selectedBrandIdsTemp.filter((id) =>
          this.brands.map((brand) => brand.id).includes(id)
        );
        this.selectedBrandIds = selectedBrandIdsChecked;
      } else {
        this.selectedBrandIds = DEFAULT_IDS;
      }

      if (types) {
        const selectedTypeIdsTemp = types ? types.split(',').map(Number) : DEFAULT_IDS;
        const selectedTypeIdsChecked = selectedTypeIdsTemp.filter((id) =>
          this.types.map((type) => type.id).includes(id)
        );
        this.selectedTypeIds = selectedTypeIdsChecked;
      } else {
        this.selectedTypeIds = DEFAULT_IDS;
      }

      const result = await this.productsService.getItems({
        pageIndex: this.currentPage - 1, // numeration of pages starts from 0 on server
        pageSize: this.pageLimit,
        brandIdFilter: this.selectedBrandIds ?? DEFAULT_IDS,
        typeIdFilter: this.selectedTypeIds ?? DEFAULT_IDS,
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

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

  public brands: Brand[] = [];
  public types: Type[] = [];
  public selectedBrand: Brand | undefined = undefined;
  public selectedBrandId = 0;
  public selectedBrandName = '';
  public selectedType: Type | undefined = undefined;
  public selectedTypeId = 0;
  public selectedTypeName = '';
  public product: Product | undefined = undefined;
  public products: Product[] = [];
  public currentPage = 1;
  public pageLimit = 6;
  public totalPages = 0;
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
    this.selectedBrand = undefined;
    this.selectedBrandId = Number(brand);
    this.selectedBrandName = '';
    this.selectedType = undefined;
    this.selectedTypeId = Number(type);
    this.selectedTypeName = '';
    this.product = undefined;
    this.products = [];
    this.isLoading = false;
    makeAutoObservable(this);
  }

  public getById = async (id: number): Promise<Product | undefined> => {
    if (new RegExp(/\/products\/\d+/).test(window.location.pathname)) {
      this.isLoading = true;
    }

    this.product = undefined;

    try {
      const result = await this.productsService.getById(id);
      this.product = result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }

    this.isLoading = false;

    return this.product;
  };

  public getBrands = async (): Promise<void> => {
    try {
      const result = await this.productsService.getBrands();
      this.brands = result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  public getTypes = async (): Promise<void> => {
    try {
      const result = await this.productsService.getTypes();
      this.types = result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  public getItems = async (): Promise<void> => {
    this.isLoading = true;
    this.product = undefined;
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
        console.log(error.message);
      }
    }

    this.isLoading = false;
  };

  public changePage = (page: number): void => {
    this.currentPage = page;
  };

  public changeBrand = (brand: Brand): void => {
    this.selectedBrand = brand;
  };

  public changeType = (type: Type): void => {
    this.selectedType = type;
  };

  public changeBrandId = (brand: number): void => {
    this.selectedBrandId = brand;
  };

  public changeTypeId = (type: number): void => {
    this.selectedTypeId = type;
  };

  public getBrandName = (brand: number): string => {
    return this.brands[brand].brand;
  };

  public getTypeName = (type: number): string => {
    return this.types[type].type;
  };

  public getBrandId = (brand: string): number => {
    return this.brands.findIndex((b) => b.brand === brand);
  };

  public getTypeId = (type: string): number => {
    return this.types.findIndex((t) => t.type === type);
  };
}

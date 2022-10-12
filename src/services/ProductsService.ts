import 'reflect-metadata';

import { inject, injectable } from 'inversify';

import type {
  BrandDto,
  PaginatedItemsDto,
  PaginatedItemsRequest,
  PaginatedItemsResponse,
  ProductDto,
  TypeDto,
} from 'dtos';
import { IoCTypes } from 'ioc';
import type { Brand, PaginatedItems, Product, Type } from 'models';
import type { ApiHeader, HttpService } from 'services/HttpService';
import { ContentType, MethodType } from 'services/HttpService';

export interface ProductsService {
  getById(id: number): Promise<Product | undefined>;
  getItems(request: PaginatedItemsRequest): Promise<PaginatedItemsResponse>;
}

@injectable()
export default class DefaultProductsService implements ProductsService {
  @inject(IoCTypes.httpService)
  private readonly httpService!: HttpService;

  private readonly catalogUrl: string = `${process.env.REACT_APP_CATALOG_API_URL}`;

  private readonly catalogRoute: string = `${this.catalogUrl}${process.env.REACT_APP_CATALOG_CONTROLLER_ROUTE}`;

  private headers: ApiHeader = {
    contentType: ContentType.Json,
    authorization: undefined,
    accessControlAllowOrigin: this.catalogUrl,
  };

  public async getById(id: number): Promise<Product | undefined> {
    const result = await this.httpService.sendAsync<ProductDto>(
      `${this.catalogRoute}/getcatalogitembyid?id=${id}`,
      MethodType.POST,
      this.headers
    );

    if (result.status === 200) {
      return result.data!;
    } else {
      console.error(
        `Product with id ${id} can't be fetched, status: ${result.status}, description: ${result.statusText}`
      );

      return undefined;
    }
  }

  public async getItems(request: PaginatedItemsRequest): Promise<PaginatedItems> {
    const result = await this.httpService.sendAsync<PaginatedItemsDto>(
      `${this.catalogRoute}/getcatalogitems/`,
      MethodType.POST,
      { ...this.headers, contentType: ContentType.Json },
      request
    );

    const paginatedItems: PaginatedItems = { data: [], total_pages: 0 };

    if (result.status === 200) {
      paginatedItems.data = result.data!.data;
      paginatedItems.total_pages = Math.ceil(Number(result.data!.count) / Number(request.pageSize));
    } else {
      console.error(`Products can't be fetched, status: ${result.status}, description: ${result.statusText}`);
    }

    return paginatedItems;
  }

  public async getBrands(): Promise<Brand[]> {
    const result = await this.httpService.sendAsync<BrandDto[]>(
      `${this.catalogRoute}/getbrands`,
      MethodType.POST,
      this.headers
    );

    if (result.status === 200) {
      return result.data!;
    } else {
      console.error(`Brands can't be fetched, status: ${result.status}, description: ${result.statusText}`);

      return [];
    }
  }

  public async getTypes(): Promise<Type[]> {
    const result = await this.httpService.sendAsync<TypeDto[]>(
      `${this.catalogRoute}/gettypes`,
      MethodType.POST,
      this.headers
    );

    if (result.status === 200) {
      return result.data!;
    } else {
      console.error(`Types can't be fetched, status: ${result.status}, description: ${result.statusText}`);

      return [];
    }
  }
}

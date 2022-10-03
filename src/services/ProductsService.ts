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
import type { Brand, Product, Type } from 'models';
import type { ApiHeader, HttpService } from 'services/HttpService';
import { ContentType, MethodType } from 'services/HttpService';

export interface ProductsService {
  getById(id: number): Promise<Product>;
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

  public async getById(id: number): Promise<Product> {
    const result = await this.httpService.sendAsync<ProductDto>(
      `${this.catalogRoute}/getcatalogitembyid?id=${id}`,
      MethodType.POST,
      this.headers
    );

    return result.data!;
  }

  public async getItems(request: PaginatedItemsRequest): Promise<PaginatedItemsResponse> {
    const result = await this.httpService.sendAsync<PaginatedItemsDto>(
      `${this.catalogRoute}/getcatalogitems/`,
      MethodType.POST,
      { ...this.headers, contentType: ContentType.Json },
      request
    );

    let data: ProductDto[] = [];
    let total_pages = 0;

    if (result.status === 200) {
      data = result.data!.data;
      total_pages = Math.ceil(Number(result.data!.count) / Number(request.pageSize));
    } else {
      console.error(`Products can't be fetched, status: ${result.status}, description: ${result.statusText}`);
    }

    return { data, total_pages };
  }

  public async getBrands(): Promise<Brand[]> {
    const result = await this.httpService.sendAsync<BrandDto[]>(
      `${this.catalogRoute}/getbrands`,
      MethodType.POST,
      this.headers
    );

    return result.data!;
  }

  public async getTypes(): Promise<Type[]> {
    const result = await this.httpService.sendAsync<TypeDto[]>(
      `${this.catalogRoute}/gettypes`,
      MethodType.POST,
      this.headers
    );

    return result.data!;
  }
}

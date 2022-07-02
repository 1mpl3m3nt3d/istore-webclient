import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

import { AuthStore, ProductsStore } from '.';
import { CartDto } from '../dtos';
import { IoCTypes } from '../ioc';
import { Cart, CartItem } from '../models';
import type { CartService } from '../services';

@injectable()
export default class CartStore {
  cartDto: CartDto = { data: '{}' };
  cart: Cart = { items: [], totalCount: 0, totalPrice: 0 };
  cartItems: CartItem[] = [];
  isLoading: boolean | undefined = undefined;

  @inject(IoCTypes.authStore)
  private readonly authStore!: AuthStore;

  @inject(IoCTypes.productsStore)
  private readonly productsStore!: ProductsStore;

  @inject(IoCTypes.cartService)
  private readonly cartService!: CartService;

  constructor() {
    this.cartDto = { data: '{}' };
    this.cart = { items: [], totalCount: 0, totalPrice: 0 };
    this.cartItems = this.cart.items;
    makeAutoObservable(this);
  }

  public getCount = (id: number): number => {
    try {
      if (this.authStore.user) {
        const index = this.cartItems?.findIndex((ci) => ci.id === id);

        return index >= 0 ? this.cartItems[index].count : 0;
      }
    } catch (error: unknown) {
      console.error(error);
    }

    return 0;
  };

  public addItem = async (id: number): Promise<void> => {
    if (!this.authStore.user) {
      await this.authStore.signinRedirect();
    }

    try {
      const index = this.cartItems?.findIndex((ci) => ci.id === id);

      if (index >= 0) {
        this.cartItems[index].count += 1;
        this.cartItems[index].totalPrice += this.cartItems[index].price;
        this.cart.totalPrice += this.cartItems[index].price;
      } else {
        await this.pushItem(id);
      }

      this.cart.items = this.cartItems;
      this.cart.totalCount += 1;
      await this.updateCart();
    } catch (error: unknown) {
      console.error(error);
    }
  };

  public removeItem = async (id: number): Promise<void> => {
    try {
      const index = this.cartItems?.findIndex((ci) => ci.id === id);

      if (index >= 0) {
        if (this.cartItems[index].count > 1) {
          this.cartItems[index].count -= 1;
          this.cartItems[index].totalPrice -= this.cartItems[index].price;
          this.cart.totalPrice -= this.cartItems[index].price;
        } else {
          this.cart.totalPrice -= this.cartItems[index].price;
          this.cartItems.splice(index, 1);
        }

        this.cart.items = this.cartItems;
        this.cart.totalCount -= 1;
        await this.updateCart();
      } else {
        console.log(
          `There is no item with [id: ${id}] in your cart to remove!`
        );
      }
    } catch (error: unknown) {
      console.error(error);
    }
  };

  public getCart = async (): Promise<void> => {
    this.isLoading = true;

    if (!this.authStore.user) {
      await this.authStore.getUser();
    }

    try {
      if (this.authStore.user) {
        this.cartService.getAuthorizationHeaders();
        const response = await this.cartService.getCart();

        if (response.data) {
          this.cartDto = response.data;
        }

        if (this.cartDto.data && this.cartDto.data !== '{}') {
          this.cart = JSON.parse(this.cartDto.data);
          this.cartItems = this.cart.items;
        } else {
          this.cart = { items: [], totalCount: 0, totalPrice: 0 };
          this.cartItems = this.cart.items;
        }
      } else {
        this.cart = { items: [], totalCount: 0, totalPrice: 0 };
        this.cartItems = this.cart.items;
      }
    } catch (error: unknown) {
      console.error(error);
    }

    this.cartDto = { data: '{}' };
    this.isLoading = false;
  };

  public updateCart = async (): Promise<void> => {
    if (!this.authStore.user) {
      await this.authStore.getUser();
    }

    try {
      this.cart.items = this.cartItems;
      const cartString = JSON.stringify(this.cart);
      this.cartDto.data = cartString;
      await this.cartService.updateCart(this.cartDto);
    } catch (error: unknown) {
      console.error(error);
    }

    this.cartDto = { data: '{}' };
  };

  public deleteCart = async (): Promise<void> => {
    if (!this.authStore.user) {
      await this.authStore.getUser();
    }

    try {
      await this.cartService.deleteCart();
    } catch (error: unknown) {
      console.error(error);
    }

    await this.getCart();
  };

  private readonly pushItem = async (id: number): Promise<void> => {
    try {
      const product = await this.productsStore.getById(id);

      if (product) {
        this.cartItems.push({
          count: 1,
          brand: product.catalogBrand.brand,
          type: product.catalogType.type,
          id: product.id,
          picture: product.pictureUrl,
          price: product.price,
          name: product.name,
          totalPrice: product.price,
        });
        this.cart.totalPrice += product.price;
      }
    } catch (error: unknown) {
      console.error(error);
    }
  };
}

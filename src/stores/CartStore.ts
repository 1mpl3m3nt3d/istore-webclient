import 'reflect-metadata';

import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

import { CartDto } from 'dtos';
import { IoCTypes } from 'ioc';
import { Cart, CartItem } from 'models';
import type { CartService } from 'services';
import { AuthStore, ProductsStore } from 'stores';

@injectable()
export default class CartStore {
  cartDto: CartDto = { data: '{}' };
  cart: Cart = { items: [], totalCount: 0, totalPrice: 0 };
  cartItems: CartItem[] = [];
  isLoading = false;
  currentCount: number | undefined = undefined;

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
    this.currentCount = undefined;
    this.isLoading = false;
    makeAutoObservable(this);
  }

  public getCount = (id: number): number => {
    try {
      const index = this.cartItems?.findIndex((ci) => ci.id === id);

      return index >= 0 ? this.cartItems[index].count : 0;
    } catch (error: unknown) {
      console.error(error);
    }

    return 0;
  };

  public setCount = async (id: number, count?: string): Promise<void> => {
    try {
      const index = this.cartItems?.findIndex((ci) => ci.id === id);
      const parsedCount = count ? Number.parseInt(count) : this.currentCount;

      if (parsedCount !== undefined && parsedCount > 0) {
        this.cartItems[index].count = parsedCount;
        this.cartItems[index].totalPrice = parsedCount * this.cartItems[index].price;

        await this.updateCart();
      } else if (parsedCount !== undefined && parsedCount < 1) {
        await this.clearItem(id);
      }

      this.currentCount = undefined;
    } catch (error: unknown) {
      console.error(error);
    }
  };

  public addItem = async (id: number): Promise<void> => {
    try {
      const index = this.cartItems?.findIndex((ci) => ci.id === id);

      if (index >= 0) {
        this.cartItems[index].count += 1;
        this.cartItems[index].totalPrice += this.cartItems[index].price;
        //this.cart.totalPrice += this.cartItems[index].price;
      } else {
        await this.pushItem(id);
      }

      this.cart.items = this.cartItems;
      //this.cart.totalCount += 1;

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
          //this.cart.totalPrice -= this.cartItems[index].price;
        } else {
          //this.cart.totalPrice -= this.cartItems[index].price;
          this.cartItems.splice(index, 1);
        }

        this.cart.items = this.cartItems;
        //this.cart.totalCount -= 1;

        await this.updateCart();
      } else {
        console.log(`There is no item with [id: ${id}] in your cart to remove!`);
      }
    } catch (error: unknown) {
      console.error(error);
    }
  };

  public clearItem = async (id: number): Promise<void> => {
    try {
      const index = this.cartItems?.findIndex((ci) => ci.id === id);

      if (index >= 0) {
        //this.cart.totalPrice -= this.cartItems[index].price;
        //this.cart.totalCount -= this.cartItems[index].count;
        this.cartItems.splice(index, 1);
        this.cart.items = this.cartItems;

        await this.updateCart();
      } else {
        console.log(`There is no item with [id: ${id}] in your cart to remove!`);
      }
    } catch (error: unknown) {
      console.error(error);
    }
  };

  public getCart = async (): Promise<void> => {
    this.isLoading = true;

    try {
      if (this.authStore.user) {
        this.cartService.getAuthorizationHeaders();

        const response = await this.cartService.getCart();

        if (response.data) {
          this.cartDto = response.data;
        }

        const basket =
          this.cartDto.data && this.cartDto.data !== '{}'
            ? JSON.parse(this.cartDto.data)
            : { items: [], totalCount: 0, totalPrice: 0 };

        const localCart: string | null = localStorage.getItem('cart');
        const parsedCart: Cart | null = localCart ? JSON.parse(localCart) : null;

        if (parsedCart?.items) {
          this.cart = this.cartMerger(parsedCart, basket);
          this.cartItems = this.cart.items;
          this.cartDto = { data: '{}' };
          await this.updateCart();
          localStorage.removeItem('cart');
        } else {
          this.cart = basket;
          this.cartItems = this.cart.items;
          this.cartDto = { data: '{}' };
          localStorage.removeItem('cart');
        }
      } else {
        const localCart = localStorage.getItem('cart');
        const parsedCart = localCart
          ? JSON.parse(localCart) ?? { items: [], totalCount: 0, totalPrice: 0 }
          : { items: [], totalCount: 0, totalPrice: 0 };

        this.cart = parsedCart;
      }

      this.cartItems = this.cart.items;
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
      this.updateCartTotals();

      this.cart.items = this.cartItems;

      const cartString = JSON.stringify(this.cart);
      this.cartDto.data = cartString;

      if (this.authStore.user) {
        this.cartService.getAuthorizationHeaders();
        await this.cartService.updateCart(this.cartDto);
      } else {
        const parsedCart: string = JSON.stringify(this.cart);
        localStorage.setItem('cart', parsedCart);
      }
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
      if (this.authStore.user) {
        this.cartService.getAuthorizationHeaders();

        await this.cartService.deleteCart();
      } else {
        localStorage.removeItem('cart');
      }
    } catch (error: unknown) {
      console.error(error);
    }

    await this.getCart();
  };

  public updateCartTotals = (): void => {
    try {
      let totalPrice = 0;
      let totalCount = 0;

      for (const item of this.cartItems) {
        totalCount += item.count;
        totalPrice += item.price * item.count;
      }

      this.cart.totalCount = totalCount;
      this.cart.totalPrice = totalPrice;
    } catch (error: unknown) {
      console.error(error);
    }
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
        //this.cart.totalPrice += product.price;
      }
    } catch (error: unknown) {
      console.error(error);
    }
  };

  private readonly cartMerger = (cart1: Cart, cart2: Cart): Cart => {
    const newCart: Cart = { items: [], totalCount: 0, totalPrice: 0 };

    //newCart.totalCount += cart1.totalCount + cart2.totalCount;
    //newCart.totalPrice += cart1.totalPrice + cart2.totalPrice;
    newCart.items = Object.assign(newCart.items, cart1.items);

    for (const item of cart2.items) {
      const index = newCart.items.findIndex((n) => n.id === item.id);

      if (index === -1) {
        newCart.items.push(item);
      } else {
        //newCart.items[index].count += item.count;
        //newCart.items[index].totalPrice += item.totalPrice;
      }
    }

    this.updateCartTotals();

    return newCart;
  };

  public changeCount = (count: number | string): void => {
    this.currentCount = typeof count === 'string' ? Number.parseInt(count) : count;
  };
}

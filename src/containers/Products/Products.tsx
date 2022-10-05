import 'reflect-metadata';

import { Grid } from '@mui/material';
import { observer } from 'mobx-react';
import { ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { LoadingSpinner } from 'components/LoadingSpinner';
import { Pagination } from 'components/Pagination';
import { ProductCard } from 'components/ProductCard';
import { SelectorBrand } from 'components/SelectorBrand';
import { SelectorType } from 'components/SelectorType';
import { IoCTypes, useInjection } from 'ioc';
import { CartStore, ProductsStore } from 'stores';

const Products = observer(() => {
  const store = useInjection<ProductsStore>(IoCTypes.productsStore);
  const cartStore = useInjection<CartStore>(IoCTypes.cartStore);
  const location = useLocation();
  const { t } = useTranslation(['products']);

  useEffect(() => {
    const getProducts = async (): Promise<void> => {
      const state = window.location.pathname.toString() + window.location.search.toString();
      await store.getItems(state);
    };

    getProducts().catch((error) => {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.log(error);
      }
    });
  }, [store, store.currentPage, store.selectedBrandId, store.selectedTypeId, location]);

  useEffect(() => {
    const getBrandsTypes = async (): Promise<void> => {
      await store.getBrands();
      await store.getTypes();
    };

    getBrandsTypes().catch((error) => {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.log(error);
      }
    });
  }, [store]);

  return (
    <>
      <Grid key={Math.random() * 12_345} container justifyContent="center" marginY={4} marginX={0.5}>
        <Grid key={Math.random() * 12_345} container justifyContent="center">
          <Grid key={Math.random() * 12_345} item mb={4} ml={2} mr={2}>
            <SelectorBrand
              label={t('selectors.brands')}
              items={store.brands}
              selectedBrandId={store.selectedBrandId}
              minWidth={250}
              onChange={store.changeBrandId}
            />
          </Grid>
          <Grid key={Math.random() * 12_345} item mb={4} ml={2} mr={2}>
            <SelectorType
              label={t('selectors.types')}
              items={store.types}
              selectedTypeId={store.selectedTypeId}
              minWidth={250}
              onChange={store.changeTypeId}
            />
          </Grid>
        </Grid>
        {store.isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Grid key={Math.random() * 12_345} container justifyContent="center">
              {store.products &&
                store.products?.map((product) => (
                  <Grid key={Math.random() * 12_345} item mb={4} ml={2} mr={2}>
                    <ProductCard count={cartStore.getCount(product.id)} product={product} />
                  </Grid>
                ))}
            </Grid>
            <Grid container justifyContent="center">
              <Pagination
                totalCount={store.totalPages}
                currentPage={store.currentPage}
                onChange={(event: ChangeEvent<unknown>, value: number): void => {
                  store.changePage(value);
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
});

export default Products;

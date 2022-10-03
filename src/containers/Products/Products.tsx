import 'reflect-metadata';

import { Grid } from '@mui/material';
import { observer } from 'mobx-react';
import { ChangeEvent, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { LoadingSpinner } from 'components/LoadingSpinner';
import { Pagination } from 'components/Pagination';
import { ProductCard } from 'components/ProductCard';
import { SelectorBrand } from 'components/SelectorBrand';
import { SelectorType } from 'components/SelectorType';
import { IoCTypes, useInjection } from 'ioc';
import { ProductsStore } from 'stores';

const Products = observer(() => {
  const store = useInjection<ProductsStore>(IoCTypes.productsStore);
  const location = useLocation();

  useEffect(() => {
    const getProducts = async (): Promise<void> => {
      await store.getItems();
    };

    getProducts().catch((error) => {
      console.log(error);
    });
  }, [store, store.currentPage, store.selectedBrandId, store.selectedTypeId, location]);

  return (
    <>
      {store.isLoading ? (
        <LoadingSpinner />
      ) : (
        <Grid key={Math.random() * 12_345} container justifyContent="center" marginY={4} marginX={0.5}>
          <Grid key={Math.random() * 12_345} container justifyContent="center">
            <Grid key={Math.random() * 12_345} item mb={4} ml={2} mr={2}>
              <SelectorBrand
                label="Select Brand"
                items={store.brands}
                selectedBrandId={store.selectedBrandId}
                minWidth={250}
                onChange={store.changeBrandId}
              />
            </Grid>
            <Grid key={Math.random() * 12_345} item mb={4} ml={2} mr={2}>
              <SelectorType
                label="Select Types"
                items={store.types}
                selectedTypeId={store.selectedTypeId}
                minWidth={250}
                onChange={store.changeTypeId}
              />
            </Grid>
          </Grid>
          <Grid key={Math.random() * 12_345} container justifyContent="center">
            {store.products?.map((product) => (
              <Grid key={Math.random() * 12_345} item mb={4} ml={2} mr={2}>
                <ProductCard product={{ ...product }} />
              </Grid>
            ))}
          </Grid>
          <Grid container justifyContent="center">
            <Pagination
              totalCount={store.totalPages}
              currentPage={store.currentPage}
              onChange={(event: ChangeEvent<unknown>, value: number): void => {
                store.changePage(value);
                const urlParameters = new URLSearchParams(window.location.search);

                if (value > 1) {
                  urlParameters.set('page', value.toString());
                } else {
                  urlParameters.delete('page');
                }

                window.location.search = urlParameters.toString();
              }}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
});

export default Products;

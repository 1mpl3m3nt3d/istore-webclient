import 'reflect-metadata';

import { Grid } from '@mui/material';
import { observer } from 'mobx-react';
import { ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoadingSpinner } from 'components/LoadingSpinner';
import { Pagination } from 'components/Pagination';
import { ProductCard } from 'components/ProductCard';
import { IoCTypes, useInjection } from 'ioc';
import { ProductsStore } from 'stores';

const Products = observer(() => {
  const store = useInjection<ProductsStore>(IoCTypes.productsStore);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async (): Promise<void> => {
      await store.getItems();
    };

    getProducts().catch((error) => {
      console.log(error);
    });
  }, [store]);

  return (
    <>
      {store.isLoading ? (
        <LoadingSpinner />
      ) : (
        <Grid key={Math.random() * 12_345} container justifyContent="center" marginY={4} marginX={0.5}>
          <Grid key={Math.random() * 12_345} container justifyContent="center">
            {store.products?.map((product) => (
              <Grid key={Math.random() * 12_345} item marginBottom={4} ml={2} mr={2}>
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
                value !== 1
                  ? navigate(`/products?page=${value}`, { replace: false })
                  : navigate('/products', { replace: false });
              }}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
});

export default Products;

import 'reflect-metadata';

import { Grid } from '@mui/material';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { LoadingSpinner } from 'components/LoadingSpinner';
import { ProductDetails } from 'components/ProductDetails';
import { IoCTypes, useInjection } from 'ioc';
import { CartStore, ProductsStore } from 'stores';

const Product = observer(() => {
  const store = useInjection<ProductsStore>(IoCTypes.productsStore);
  const cartStore = useInjection<CartStore>(IoCTypes.cartStore);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getProduct = async (): Promise<void> => {
      const result = await store.getById(Number(id));

      if (result === undefined) {
        navigate('/', { replace: false, preventScrollReset: true });
      }
    };

    getProduct().catch((error) => {
      console.log(error);
    });
  }, [store, id, navigate]);

  return (
    <>
      {store.isLoading ? (
        <LoadingSpinner />
      ) : (
        store.product && (
          <Grid key={Math.random() * 12_345} container justifyContent="center" marginY={4} marginX={1}>
            <Grid key={Math.random() * 12_345} container justifyContent="center">
              <Grid item margin={0}>
                <ProductDetails count={cartStore.getCount(Number(id))} product={store.product} />
              </Grid>
            </Grid>
          </Grid>
        )
      )}
    </>
  );
});

export default Product;

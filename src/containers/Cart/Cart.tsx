import 'reflect-metadata';

import { Grid, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import { CartCard } from 'components/CartCard';
import { CheckoutButton } from 'components/CheckoutButton';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { IoCTypes, useInjection } from 'ioc';
import { useEffect } from 'react';
import { CartStore } from 'stores';

const Cart = observer(() => {
  const cartStore = useInjection<CartStore>(IoCTypes.cartStore);
  const { t } = useTranslation(['cart']);

  useEffect(() => {
    const getCart = async (): Promise<void> => {
      await cartStore.getCart();
    };

    getCart().catch((error) => {
      console.log(error);
    });
  }, [cartStore]);

  return (
    <>
      {cartStore.isLoading ? (
        <LoadingSpinner />
      ) : (
        <Grid
          key={Math.random() * 12_345}
          container
          justifyContent="center"
          marginY={4}
          marginX={1}
        >
          <Grid key={Math.random() * 12_345} container justifyContent="center">
            {cartStore.cart.items.length > 0 ? (
              <Stack direction="column">
                {cartStore.cart.items.map((cartItem) => (
                  <Grid
                    key={Math.random() * 12_345}
                    item
                    justifyContent="center"
                    marginBottom={4}
                  >
                    <CartCard cartItem={cartItem} />
                  </Grid>
                ))}
                <Grid key={Math.random() * 12_345} item justifyContent="center">
                  <CheckoutButton totalPrice={cartStore.cart.totalPrice} />
                </Grid>
              </Stack>
            ) : (
              <Grid
                display="flex"
                key={Math.random() * 12_345}
                item
                textAlign="center"
                justifyContent="center"
                justifyItems="center"
                justifySelf="center"
                alignContent="center"
                alignItems="center"
                alignSelf="center"
                minHeight="100%"
                minWidth="100%"
              >
                <Typography whiteSpace="pre-line">
                  {t('placeholder.empty')}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
});

export default Cart;

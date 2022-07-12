import 'reflect-metadata';

import { CartCard } from 'components/CartCard';
import { CheckoutButton } from 'components/CheckoutButton';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import { Box, Grid, Stack, Typography } from '@mui/material';

import { IoCTypes, useInjection } from 'ioc';
import { CartStore } from 'stores';

const Cart = observer(() => {
  const cartStore = useInjection<CartStore>(IoCTypes.cartStore);
  const { t } = useTranslation(['cart']);

  return (
    <Grid container justifyContent="center">
      {cartStore.isLoading ? (
        <Box>
          <LoadingSpinner />
        </Box>
      ) : (
        <>
          <Grid
            key={Math.random() * 12_345}
            container
            justifyContent="center"
            mt={4}
          >
            <h1>{t('title')}</h1>
          </Grid>
          <Grid
            key={Math.random() * 12_345}
            container
            justifyContent="center"
            mb={4}
          >
            {cartStore.cart.items.length > 0 ? (
              <Stack direction="column">
                {cartStore.cart.items.map((cartItem) => (
                  <Grid
                    key={Math.random() * 12_345}
                    item
                    justifyContent="center"
                    m={1}
                  >
                    <CartCard cartItem={cartItem} />
                  </Grid>
                ))}
                <Grid
                  key={Math.random() * 12_345}
                  item
                  justifyContent="center"
                  m={2}
                >
                  <CheckoutButton totalPrice={cartStore.cart.totalPrice} />
                </Grid>
              </Stack>
            ) : (
              <Grid
                key={Math.random() * 12_345}
                item
                justifyContent="center"
                textAlign="center"
                m={2}
              >
                <Typography whiteSpace="pre-line">
                  {t('placeholder.empty')}
                </Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
});

export default Cart;

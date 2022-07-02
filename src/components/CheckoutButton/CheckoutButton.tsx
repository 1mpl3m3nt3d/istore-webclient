import 'reflect-metadata';
import '../../locales/config';

import React from 'react';

import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Stack } from '@mui/material';

import { IoCTypes, useInjection } from '../../ioc';
import { CartStore } from '../../stores';

const CheckoutButton = observer(() => {
  const cartStore = useInjection<CartStore>(IoCTypes.cartStore);
  const navigate = useNavigate();
  const { t } = useTranslation(['cart']);

  return (
    <Stack direction="column" justifyContent="center">
      <Button
        variant="contained"
        onClick={async (): Promise<void> => {
          await cartStore.deleteCart();
          navigate('/products', { replace: false });
        }}
      >
        {t('checkout')}
      </Button>
    </Stack>
  );
});

export default CheckoutButton;

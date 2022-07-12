import 'reflect-metadata';

import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Stack } from '@mui/material';

import { IoCTypes, useInjection } from 'ioc';
import { CartStore } from 'stores';

interface Properties {
  totalPrice: number;
}

const CheckoutButton = observer((properties: Properties) => {
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
        {`${t('checkout')} • ${properties.totalPrice}
        ${t('currency', { ns: 'consts' })}`}
      </Button>
    </Stack>
  );
});

export default CheckoutButton;

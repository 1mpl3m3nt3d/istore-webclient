/* eslint-disable i18next/no-literal-string */

import 'reflect-metadata';
import '../../locales/config';

import React from 'react';

import { observer } from 'mobx-react';

import { Button, Stack } from '@mui/material';

import { IoCTypes, useInjection } from '../../ioc';
import { CartStore } from '../../stores';

interface Properties {
  productId: number;
  count: number;
  direction: 'column' | 'row';
}

const BuyButtonCart = observer((properties: Properties) => {
  const cartStore = useInjection<CartStore>(IoCTypes.cartStore);

  return (
    <Stack direction={properties.direction}>
      <Button
        sx={{
          fontSize: '1rem',
          margin: 0,
          padding: 0,
          minHeight: '36px',
          minWidth: '36px',
        }}
        size="small"
        variant="outlined"
        onClick={async (): Promise<void> => {
          await cartStore.addItem(properties.productId);
        }}
      >
        +
      </Button>
      <Button
        disabled
        sx={{
          fontSize: '1rem',
          margin: 0,
          padding: 0,
          minHeight: '36px',
          minWidth: '36px',
        }}
        size="small"
        variant="outlined"
      >
        {properties.count}
      </Button>
      <Button
        sx={{
          fontSize: '1rem',
          margin: 0,
          padding: 0,
          minHeight: '36px',
          minWidth: '36px',
        }}
        size="small"
        variant="outlined"
        onClick={async (): Promise<void> => {
          await cartStore.removeItem(properties.productId);
        }}
      >
        -
      </Button>
    </Stack>
  );
});

export default BuyButtonCart;

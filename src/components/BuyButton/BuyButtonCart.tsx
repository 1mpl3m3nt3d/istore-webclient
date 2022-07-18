/* eslint-disable i18next/no-literal-string */

import 'reflect-metadata';

import { Button, ButtonGroup } from '@mui/material';
import { observer } from 'mobx-react';

import { IoCTypes, useInjection } from 'ioc';
import { CartStore } from 'stores';

interface Properties {
  productId: number;
  count: number;
}

const BuyButtonCart = observer((properties: Properties) => {
  const cartStore = useInjection<CartStore>(IoCTypes.cartStore);

  return (
    <ButtonGroup size="small">
      <Button
        sx={{
          fontSize: '1.0rem',
          margin: 0,
          padding: 0,
          minHeight: '30px !important',
          minWidth: '30px !important',
        }}
        size="small"
        variant="outlined"
        onClick={async (): Promise<void> => {
          await cartStore.removeItem(properties.productId);
        }}
      >
        -
      </Button>
      <Button
        size="small"
        variant="outlined"
        sx={{
          cursor: 'not-allowed',
          pointerEvents: 'none',
          fontSize: '1.0rem',
          margin: 0,
          padding: 0,
          textAlign: 'center',
          minHeight: '30px !important',
        }}
      >
        {properties.count}
      </Button>
      <Button
        sx={{
          fontSize: '1.0rem',
          margin: 0,
          padding: 0,
          minHeight: '30px !important',
          minWidth: '30px !important',
        }}
        size="small"
        variant="outlined"
        onClick={async (): Promise<void> => {
          await cartStore.addItem(properties.productId);
        }}
      >
        +
      </Button>
    </ButtonGroup>
  );
});

export default BuyButtonCart;

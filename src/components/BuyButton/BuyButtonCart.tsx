import 'reflect-metadata';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, ButtonGroup, Stack } from '@mui/material';
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
    <Stack direction="row">
      <ButtonGroup size="small" sx={{ marginRight: 1 }}>
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
            await cartStore.clearItem(properties.productId);
          }}
        >
          <DeleteForeverIcon />
        </Button>
      </ButtonGroup>
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
    </Stack>
  );
});

export default BuyButtonCart;

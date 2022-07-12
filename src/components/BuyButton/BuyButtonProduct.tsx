/* eslint-disable i18next/no-literal-string */

import 'reflect-metadata';

import { observer } from 'mobx-react';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {
  Button,
  ButtonGroup,
  IconButton,
  Stack,
  Tooltip,
  Zoom,
} from '@mui/material';

import { IoCTypes, useInjection } from 'ioc';
import { CartStore } from 'stores';

interface Properties {
  productId: number;
}

const BuyButtonProduct = observer((properties: Properties) => {
  const cartStore = useInjection<CartStore>(IoCTypes.cartStore);
  const count = cartStore.getCount(properties.productId);

  return (
    <>
      {count <= 0 && (
        <Tooltip
          title="Add to cart"
          placement="bottom"
          enterDelay={1000}
          leaveDelay={200}
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 300 }}
        >
          <Stack>
            <IconButton
              onClick={async (): Promise<void> => {
                await cartStore.addItem(properties.productId);
              }}
            >
              <AddShoppingCartIcon />
            </IconButton>
          </Stack>
        </Tooltip>
      )}
      {count > 0 && (
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
            {count}
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
      )}
    </>
  );
});

export default BuyButtonProduct;

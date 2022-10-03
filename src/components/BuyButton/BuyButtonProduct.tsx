import 'reflect-metadata';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, ButtonGroup, IconButton, Stack, Tooltip, Zoom } from '@mui/material';
import { observer } from 'mobx-react';

import { IoCTypes, useInjection } from 'ioc';
import { CartStore } from 'stores';

interface Properties {
  productId: number;
}

const BuyButtonProduct = observer((properties: Properties) => {
  const cartStore = useInjection<CartStore>(IoCTypes.cartStore);
  const count = cartStore.getCount(properties.productId);

  return (
    <Stack direction="row">
      {count <= 0 && (
        <Tooltip
          title="Add to cart"
          placement="bottom"
          enterDelay={600}
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
        <>
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
        </>
      )}
    </Stack>
  );
});

export default BuyButtonProduct;

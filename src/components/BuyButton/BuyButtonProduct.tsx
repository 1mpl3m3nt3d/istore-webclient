import 'reflect-metadata';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, Button, ButtonGroup, IconButton, Stack, TextField, Tooltip, Zoom } from '@mui/material';
import { observer } from 'mobx-react';

import { IoCTypes, useInjection } from 'ioc';
import { CartStore } from 'stores';

interface Properties {
  productId: number;
}

const BuyButtonProduct = observer(({ productId }: Properties) => {
  const cartStore = useInjection<CartStore>(IoCTypes.cartStore);
  const count = cartStore.getCount(productId);

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
                await cartStore.addItem(productId);
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
                await cartStore.clearItem(productId);
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
                await cartStore.removeItem(productId);
              }}
            >
              <span>-</span>
            </Button>
            <Box width="30%">
              <TextField
                onChange={(ev): void => {
                  ev.preventDefault();
                  cartStore.changeCount(ev.target.value);
                }}
                onBlur={async (ev): Promise<void> => {
                  ev.preventDefault();
                  await cartStore.setCount(productId);
                }}
                onKeyDown={async (ev): Promise<void> => {
                  if (ev.key === 'Enter') {
                    ev.preventDefault();
                    await cartStore.setCount(productId);
                  }
                }}
                InputProps={{
                  sx: {
                    fontSize: '1.0rem',
                    margin: 0,
                    padding: 0,
                    minWidth: '30px !important',
                    minHeight: '30px !important',
                    textAlign: 'center',
                    borderRadius: 0,
                  },
                }}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  sx: {
                    fontSize: '1.0rem',
                    margin: 0,
                    padding: 0,
                    minWidth: '30px !important',
                    minHeight: '30px !important',
                    textAlign: 'center',
                    borderRadius: 0,
                  },
                }}
                variant="outlined"
                defaultValue={count}
                size="small"
                margin="none"
                type="text"
              />
            </Box>
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
                await cartStore.addItem(productId);
              }}
            >
              <span>+</span>
            </Button>
          </ButtonGroup>
        </>
      )}
    </Stack>
  );
});

export default BuyButtonProduct;

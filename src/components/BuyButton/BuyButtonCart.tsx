import 'reflect-metadata';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, Button, ButtonGroup, Stack, TextField } from '@mui/material';
import { observer } from 'mobx-react';

import { IoCTypes, useInjection } from 'ioc';
import { CartStore } from 'stores';

interface Properties {
  productId: number;
  count: number;
}

const BuyButtonCart = observer(({ productId, count }: Properties) => {
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
        <Box width="3em">
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
    </Stack>
  );
});

export default BuyButtonCart;

import 'reflect-metadata';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, Button, ButtonGroup, IconButton, Stack, TextField, Tooltip, Zoom } from '@mui/material';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IoCTypes, useInjection } from 'ioc';
import { CartStore } from 'stores';

interface Properties {
  productId: number;
}

const BuyButtonProduct = observer(({ productId }: Properties) => {
  const store = useInjection<CartStore>(IoCTypes.cartStore);
  const { t } = useTranslation(['products']);

  let item = store.cart.items.find((p) => p.id === productId);
  let itemCount = item ? item.count : 0;

  const [count, setCount] = useState<string>(itemCount.toString());

  const handleChange = (): void => {
    item = store.cart.items.find((p) => p.id === productId);
    itemCount = item ? item.count : 0;
    setCount(itemCount.toString());
  };

  return (
    <Stack direction="row">
      {itemCount <= 0 && (
        <Tooltip
          title={t('tooltips.cart_add')}
          placement="bottom"
          enterDelay={600}
          leaveDelay={200}
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 300 }}
        >
          <Stack>
            <IconButton
              onClick={async (): Promise<void> => {
                await store.addItem(productId);
                handleChange();
              }}
            >
              <AddShoppingCartIcon />
            </IconButton>
          </Stack>
        </Tooltip>
      )}
      {itemCount > 0 && (
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
                await store.clearItem(productId);
                handleChange();
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
                await store.removeItem(productId);
                handleChange();
              }}
            >
              <span>{t('values.remove')}</span>
            </Button>
            <Box width="3em">
              <TextField
                onChange={(ev): void => {
                  ev.preventDefault();
                  const newValue = ev.target.value;
                  const regex = new RegExp(/^\d*$/);

                  if (regex.test(newValue)) {
                    setCount(newValue);
                  }
                }}
                onBlur={async (ev): Promise<void> => {
                  ev.preventDefault();
                  await store.setCount(productId, count);
                  handleChange();
                }}
                onKeyDown={async (ev): Promise<void> => {
                  if (ev.key === 'Enter') {
                    ev.preventDefault();
                    await store.setCount(productId, count);
                    handleChange();
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
                  pattern: '^\\d*$',
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
                value={count}
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
                await store.addItem(productId);
                handleChange();
              }}
            >
              <span>{t('values.add')}</span>
            </Button>
          </ButtonGroup>
        </>
      )}
    </Stack>
  );
});

export default BuyButtonProduct;

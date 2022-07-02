import 'reflect-metadata';
import '../../locales/config';

import React from 'react';

import { BuyButtonCart } from 'components/BuyButton';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';

import { CartItem } from '../../models';
import { useTranslation } from 'react-i18next';

interface Properties {
  cartItem: CartItem;
}

const CartCard = observer((properties: Properties) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id, brand, type, name, picture, count, price, totalPrice } =
    properties.cartItem;

  return (
    <Card
      className="productCard"
      sx={{
        width: 'inherit',
        maxWidth: 1000,
        padding: 2,
        textAlign: 'center',
      }}
    >
      <Stack direction="column">
        <Stack direction="row" justifyContent="space-between" marginBottom={1}>
          <Stack>
            <CardMedia
              component="img"
              image={picture}
              alt={`${name}`}
              sx={{
                display: 'grid',
                alignContent: 'center',
                justifyContent: 'left',
                textAlign: 'left',
                margin: 0,
                marginRight: 1,
                padding: 0,
                height: 'auto',
                width: 'auto',
                maxHeight: 100,
                maxWidth: 150,
                border: 'dotted',
                borderWidth: 1,
              }}
              onClick={(): void => {
                navigate(`/products/${id}`, { replace: false });
              }}
            />
          </Stack>
          <Stack>
            <CardContent
              className="no-pb"
              sx={{
                display: 'grid',
                alignContent: 'center',
                justifyContent: 'right',
                textAlign: 'right',
                margin: 0,
                marginLeft: 1,
                padding: 0,
              }}
            >
              <Stack direction="column">
                <Typography>{type}</Typography>
                <Typography>{brand}</Typography>
                <Typography>{name}</Typography>
                <Typography>
                  {price}
                  {t('currency', { ns: 'consts' })}
                </Typography>
              </Stack>
            </CardContent>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          marginTop={1}
          height="fit-content"
        >
          <CardContent
            sx={{
              display: 'grid',
              alignContent: 'center',
              justifyContent: 'left',
              textAlign: 'left',
              margin: 0,
              padding: 0,
              paddingBottom: '0px !important',
            }}
          >
            <BuyButtonCart direction="row" count={count} productId={id} />
          </CardContent>
          <CardContent
            sx={{
              display: 'grid',
              alignContent: 'center',
              justifyContent: 'right',
              textAlign: 'right',
              margin: 0,
              padding: 0,
              paddingBottom: '0px !important',
            }}
          >
            <Stack>
              <Typography>
                <strong>{t('totalPrice', { ns: 'cart' })}:</strong>
              </Typography>
              <Typography>
                {totalPrice}
                {t('currency', { ns: 'consts' })}
              </Typography>
            </Stack>
          </CardContent>
        </Stack>
      </Stack>
    </Card>
  );
});

export default CartCard;

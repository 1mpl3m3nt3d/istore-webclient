/* eslint-disable unicorn/no-null */

import 'reflect-metadata';
import '../../locales/config';

import React from 'react';

import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { Product } from '../../models';
import { BuyButtonProduct } from '../BuyButton';

interface Properties {
  product: Product | undefined;
}

const ProductDetails = observer((properties: Properties) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['products']);

  if (!properties.product) {
    return null;
  }

  const {
    id,
    name,
    price,
    description,
    pictureUrl,
    catalogBrand,
    catalogType,
  } = properties.product;

  return (
    <Stack direction="column">
      <Stack>
        <Card
          sx={{
            height: 'fit-content',
            maxHeight: 1200,
            width: 'fit-content',
            maxWidth: 700,
            display: 'grid',
            justifyContent: 'center',
            alignContent: 'center',
            textAlign: 'center',
          }}
        >
          <CardContent
            sx={{
              padding: 0.5,
              margin: 0.5,
            }}
          >
            <Stack
              direction="row"
              justifyContent="center"
              alignContent="space-between"
              spacing={6}
              marginY={3}
            >
              <Stack justifyContent="center" alignContent="center">
                <Avatar
                  className="avatar"
                  src={`${process.env.PUBLIC_URL}/logo512.png`}
                />
              </Stack>
              <Stack
                direction="column"
                justifyContent="center"
                alignContent="center"
                height={80}
              >
                <Typography variant="h4">{catalogBrand.brand}</Typography>
                <Typography variant="h3">{name}</Typography>
              </Stack>
            </Stack>
          </CardContent>
          <CardMedia
            component="img"
            image={pictureUrl}
            alt={`${catalogBrand.brand} ${name}`}
            onClick={(): void => {
              navigate(`/products/${id}`, { replace: false });
            }}
          />
          <CardContent
            sx={{ padding: 0.5, margin: 0.5, marginX: 2, textAlign: 'left' }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography>{t('properties.type')}:</Typography>
              <Typography>{catalogType.type}</Typography>
            </Stack>
          </CardContent>
          <CardContent
            sx={{ padding: 0.5, margin: 0.5, marginX: 2, textAlign: 'left' }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography>{t('properties.brand')}:</Typography>
              <Typography>{catalogBrand.brand}</Typography>
            </Stack>
          </CardContent>
          <CardContent
            sx={{ padding: 0.5, margin: 0.5, marginX: 2, textAlign: 'left' }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography>{t('properties.name')}:</Typography>
              <Typography>{name}</Typography>
            </Stack>
          </CardContent>
          <CardContent sx={{ padding: 0.5, margin: 0.5, marginX: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>{t('properties.price')}:</Typography>
              <Typography>
                {price} {t('consts:currency')}
              </Typography>
            </Stack>
          </CardContent>
          <CardContent>
            <TextField
              color="info"
              fullWidth
              multiline
              focused
              InputProps={{
                readOnly: true,
              }}
              id="outlined-multiline-static"
              label={t('properties.description')}
              rows={0}
              value={description}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', padding: 1, margin: 1 }}>
            <BuyButtonProduct productId={id} />
          </CardActions>
        </Card>
      </Stack>
    </Stack>
  );
});

export default ProductDetails;

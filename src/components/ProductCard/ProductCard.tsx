/* eslint-disable unicorn/no-null */

import 'reflect-metadata';

import { useState } from 'react';

import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';

import { Product } from 'models';
import { BuyButtonProduct } from '../BuyButton';

interface Properties {
  product: Product | undefined;
}

const ProductCard = observer((properties: Properties) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['products']);
  const [expanded, setExpanded] = useState<boolean>(false);

  if (!properties.product) {
    return null;
  }

  const handleExpandClick = (): void => {
    setExpanded(!expanded);
  };

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
    <Card
      className="productCard"
      sx={{ width: 350, maxWidth: 350, padding: 1 }}
    >
      <Stack
        sx={{
          maxHeight: 60,
          padding: 0,
          margin: 0,
        }}
        justifyContent="center"
        alignContent="center"
        textAlign="center"
      >
        <CardContent sx={{ padding: 1, paddingBottom: '8px !important' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignContent="center"
          >
            <Stack
              sx={{
                margin: 1,
              }}
              justifyContent="center"
              alignContent="center"
            >
              <Avatar src={`${process.env.PUBLIC_URL}/logo512.png`} />
            </Stack>
            <Stack
              direction="column"
              justifyContent="center"
              alignContent="center"
            >
              <Typography
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                  WebkitLineClamp: '1',
                  WebkitBoxOrient: 'vertical',
                }}
              >
                <Tooltip
                  title={catalogBrand.brand}
                  placement="top"
                  enterDelay={1000}
                  leaveDelay={200}
                  TransitionComponent={Zoom}
                  TransitionProps={{ timeout: 300 }}
                >
                  <strong>{catalogBrand.brand}</strong>
                </Tooltip>
              </Typography>
              <Typography
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                  WebkitLineClamp: '1',
                  WebkitBoxOrient: 'vertical',
                }}
              >
                <Tooltip
                  title={name}
                  placement="bottom"
                  enterDelay={1000}
                  leaveDelay={200}
                  TransitionComponent={Zoom}
                  TransitionProps={{ timeout: 300 }}
                >
                  <strong>{name}</strong>
                </Tooltip>
              </Typography>
            </Stack>
            <Stack justifyContent="center" alignContent="center">
              <Tooltip
                title="Details"
                placement="top"
                enterDelay={1000}
                leaveDelay={200}
                TransitionComponent={Zoom}
                TransitionProps={{ timeout: 300 }}
              >
                <IconButton
                  className="detailsButton"
                  onClick={(): void => {
                    navigate(`/products/${id}`, { replace: false });
                  }}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </CardContent>
      </Stack>
      <Stack>
        <CardMedia
          component="img"
          image={pictureUrl}
          alt={`${catalogBrand.brand} ${name}`}
          sx={{
            display: 'grid',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
            textAlign: 'center',
            height: 200,
            maxHeight: 200,
            maxWidth: 350,
            padding: 0,
            objectFit: 'contain',
          }}
          onClick={(): void => {
            navigate(`/products/${id}`, { replace: false });
          }}
        />
      </Stack>
      <CardContent sx={{ padding: 0, margin: 0, marginX: 1 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography textAlign="left" marginRight={6}>
            <strong>{t('properties.type')}:</strong>
          </Typography>
          <Typography
            textAlign="right"
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'pre-line',
              wordBreak: 'break-all',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
            }}
          >
            <Tooltip
              title={catalogType.type}
              placement="top"
              enterDelay={1000}
              leaveDelay={200}
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 300 }}
            >
              <span>{catalogType.type}</span>
            </Tooltip>
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography textAlign="left" marginRight={6}>
            <strong>{t('properties.price')}:</strong>
          </Typography>
          <Typography
            textAlign="right"
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'pre-line',
              wordBreak: 'break-all',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
            }}
          >
            <Tooltip
              title={`${price} ${t('consts:currency')}`}
              placement="bottom"
              enterDelay={1000}
              leaveDelay={200}
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 300 }}
            >
              <span>
                {price} {t('consts:currency')}
              </span>
            </Tooltip>
          </Typography>
        </Stack>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: 'space-between',
          height: 40,
          maxHeight: 40,
          padding: 0,
          margin: 1,
          marginBottom: 0,
        }}
      >
        <Stack>
          <BuyButtonProduct productId={id} />
        </Stack>
        <Tooltip
          title="Description"
          placement="bottom"
          enterDelay={1000}
          leaveDelay={200}
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 300 }}
        >
          <Stack>
            <Button
              className="expandProductButton"
              sx={{ transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)' }}
              onClick={handleExpandClick}
            >
              <ExpandMoreIcon />
            </Button>
          </Stack>
        </Tooltip>
      </CardActions>
      <Collapse unmountOnExit in={expanded}>
        <CardContent sx={{ padding: 1, paddingBottom: '8px !important' }}>
          <TextField
            color="info"
            fullWidth
            multiline
            focused
            sx={{
              fontSize: '1.0rem',
            }}
            InputProps={{
              sx: {
                fontSize: '1.0rem',
              },
              readOnly: true,
            }}
            InputLabelProps={{
              sx: { fontSize: '1.1rem', lineHeight: '1.4rem' },
            }}
            id="outlined-multiline-static"
            label={t('properties.description')}
            rows={0}
            value={description}
          />
        </CardContent>
      </Collapse>
    </Card>
  );
});

export default ProductCard;

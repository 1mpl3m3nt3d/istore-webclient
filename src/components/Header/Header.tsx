import 'reflect-metadata';
import '../../locales/config';

import React, { useEffect } from 'react';

import { IoCTypes, useInjection } from 'ioc';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthStore, CartStore } from 'stores';

import DescriptionIcon from '@mui/icons-material/Description';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, Button, Paper, Stack } from '@mui/material';

const Header = observer(() => {
  const navigate = useNavigate();
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);
  const cartStore = useInjection<CartStore>(IoCTypes.cartStore);
  const { t } = useTranslation(['header']);

  useEffect(() => {
    const getAuthenticationStatus = async (): Promise<void> => {
      await authStore.signinSilent();

      if (!authStore.user) {
        await authStore.getUser();
      }
    };

    getAuthenticationStatus().catch((error) => {
      console.log(error);
    });
  }, [authStore]);

  useEffect(() => {
    const getCart = async (): Promise<void> => {
      await cartStore.getCart();
    };

    getCart().catch((error) => {
      console.log(error);
    });
  }, [authStore.user, cartStore]);

  return (
    <>
      <Paper
        sx={{
          display: 'grid',
          height: 'inherit',
          justifyContent: 'center',
          justifyItems: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        <Stack
          direction="row"
          marginTop={2.5}
          marginBottom={2.5}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent="center"
          justifyItems="center"
          justifySelf="center"
          alignContent="center"
          alignItems="center"
          alignSelf="center"
        >
          <Button
            sx={{ height: 45, width: 'auto' }}
            className="productsButton"
            color="warning"
            endIcon={<DescriptionIcon />}
            variant="contained"
            onClick={(): void => {
              navigate('/products', { replace: false });
            }}
          >
            {t('products')}
          </Button>
          <Badge
            color="secondary"
            badgeContent={cartStore.cart?.totalCount ?? undefined}
          >
            <Button
              sx={{ height: 45, width: 'auto' }}
              className="cartButton"
              color="warning"
              endIcon={<ShoppingCartIcon />}
              variant="contained"
              onClick={(): void => {
                navigate('/cart', { replace: false });
              }}
            >
              {t('cart')}
            </Button>
          </Badge>
          {!authStore.user && (
            <Button
              sx={{ height: 45, width: 'auto' }}
              className="signinButton"
              color="error"
              endIcon={<LoginIcon />}
              variant="contained"
              onClick={(): void => {
                navigate('/signin', { replace: false });
              }}
            >
              {t('signin')}
            </Button>
          )}
          {Boolean(authStore.user) && (
            <Button
              sx={{ height: 45, width: 'auto' }}
              className="signoutButton"
              color="error"
              endIcon={<LogoutIcon />}
              variant="contained"
              onClick={(): void => {
                navigate('/signout', { replace: false });
              }}
            >
              {`${t('signout')}`}
              <br />
              {`[${authStore.user?.profile.given_name?.slice(0, 9)}]`}
            </Button>
          )}
        </Stack>
      </Paper>
    </>
  );
});

export default Header;

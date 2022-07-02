import 'reflect-metadata';
import 'locales/config';

import React, { useEffect } from 'react';

import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { observer } from 'mobx-react';
import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import { IoCTypes, useInjection } from '../../ioc';
import { AuthStore, CartStore } from '../../stores';

const Layout = observer(() => {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);
  const cartStore = useInjection<CartStore>(IoCTypes.cartStore);

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
    <Box className="layout">
      <Box className="header">
        <Header />
      </Box>
      <Box className="outlet">
        <Outlet />
      </Box>
      <Box className="footer">
        <Footer />
      </Box>
    </Box>
  );
});

export default Layout;

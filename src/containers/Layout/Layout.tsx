import 'reflect-metadata';

import { useEffect } from 'react';

import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { observer } from 'mobx-react';
import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import { IoCTypes, useInjection } from 'ioc';
import { AuthStore, CartStore } from 'stores';

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
  }, [cartStore]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Box
        position="relative"
        top={0}
        left={0}
        right={0}
        width="100%"
        mb="auto"
      >
        <Header />
      </Box>
      <Box position="relative">
        <Outlet />
      </Box>
      <Box
        position="relative"
        bottom={0}
        left={0}
        right={0}
        width="100%"
        mt="auto"
      >
        <Footer />
      </Box>
    </Box>
  );
});

export default Layout;

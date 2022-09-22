import 'reflect-metadata';

import { Box } from '@mui/material';
import { observer } from 'mobx-react';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Checkout } from 'components/Checkout';
import { LoadingSpinner } from 'components/LoadingSpinner';
import {
  SigninRedirect,
  SigninRedirectCallback,
  SigninSilentCallback,
  SignoutRedirect,
  SignoutRedirectCallback,
} from 'components/OidcAuthorization';
import { Layout } from 'containers/Layout';
import { AuthorizedOutlet } from 'routes';

const Cart = lazy(async () => import('containers/Cart/Cart'));
const Product = lazy(async () => import('containers/Product/Product'));
const Products = lazy(async () => import('containers/Products/Products'));

const AppRoutes = observer(() => (
  <Suspense
    fallback={
      <Box
        id="suspenseFallback"
        className="suspenseFallback"
        display="flex"
        flexDirection="column"
        minWidth="100%"
        minHeight="100vh"
      >
        <Box position="relative" top={0} left={0} right={0} bottom={0} minWidth="100%" margin="auto">
          <LoadingSpinner />
        </Box>
      </Box>
    }
  >
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate replace to="/" />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/login/callback" element={<SigninRedirectCallback />} />
          <Route path="/logout/callback" element={<SignoutRedirectCallback />} />
          <Route path="/signin" element={<SigninRedirect />} />
          <Route path="/signin-oidc" element={<SigninRedirectCallback />} />
          <Route path="/signin/calback" element={<SigninRedirect />} />
          <Route path="/signout" element={<SignoutRedirect />} />
          <Route path="/signout-oidc" element={<SignoutRedirectCallback />} />
          <Route path="/signout/callback" element={<SignoutRedirectCallback />} />
          <Route path="/silentrenew" element={<SigninSilentCallback />} />
          <Route element={<AuthorizedOutlet />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </Suspense>
));

export default AppRoutes;

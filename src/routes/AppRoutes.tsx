import 'reflect-metadata';

import React, { Suspense } from 'react';

import { observer } from 'mobx-react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthorizedOutlet } from 'routes';

import { Box } from '@mui/material';

import { LoadingSpinner } from 'components/LoadingSpinner';
import {
  SigninRedirect,
  SigninRedirectCallback,
  SigninSilentCallback,
  SignoutRedirect,
  SignoutRedirectCallback,
} from 'components/OidcAuthorization';
import { Layout } from 'containers/Layout';

const Cart = React.lazy(async () => import('containers/Cart/Cart'));
const Product = React.lazy(async () => import('containers/Product/Product'));
const Products = React.lazy(async () => import('containers/Products/Products'));

const AppRoutes = observer(() => (
  <Suspense
    fallback={
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <LoadingSpinner />
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
          <Route path="/signin" element={<SigninRedirect />} />
          <Route path="/signin-oidc" element={<SigninRedirectCallback />} />
          <Route path="/signin/callback" element={<SigninRedirectCallback />} />
          <Route path="/signout-oidc" element={<SignoutRedirectCallback />} />
          <Route
            path="/signout/callback"
            element={<SignoutRedirectCallback />}
          />
          <Route path="/signout" element={<SignoutRedirect />} />
          <Route path="/silentrenew" element={<SigninSilentCallback />} />
          <Route element={<AuthorizedOutlet />}>
            <Route path="/cart" element={<Cart />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </Suspense>
));

export default AppRoutes;

/* eslint-disable @typescript-eslint/explicit-function-return-type */

import 'reflect-metadata';

import { IoCTypes, useInjection } from 'ioc';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthStore, CartStore } from 'stores';

import DescriptionIcon from '@mui/icons-material/Description';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Avatar,
  Badge,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
} from '@mui/material';
import React from 'react';

import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';

const Header = observer(() => {
  const navigate = useNavigate();
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);
  const cartStore = useInjection<CartStore>(IoCTypes.cartStore);
  const { t } = useTranslation(['header']);

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: '0px',
        display: 'grid',
        justifyContent: 'center',
        justifyItems: 'center',
        alignContent: 'center',
        alignItems: 'center',
        px: 0,
        pt: 2,
        pb: 1,
        mb: 'auto',
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="center"
        justifyItems="center"
        alignContent="center"
        alignItems="center"
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
          <Tooltip title={t('login')}>
            <IconButton
              className="signinButton"
              onClick={(): void => {
                navigate('/signin', { replace: false });
              }}
            >
              <Avatar
                variant="circular"
                sx={{ width: 45, height: 45, bgcolor: 'darkcyan' }}
              >
                <LoginIcon />
              </Avatar>
            </IconButton>
          </Tooltip>
        )}
        {Boolean(authStore.user) && (
          <PopupState variant="popover" popupId="account-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Tooltip title="Account settings">
                  <IconButton {...bindTrigger(popupState)}>
                    <Avatar
                      variant="circular"
                      sx={{ width: 45, height: 45, bgcolor: 'darkcyan' }}
                    >
                      {authStore.user?.profile?.given_name?.slice(0, 1)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  {...bindMenu(popupState)}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      'overflow': 'visible',
                      'filter': 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      'mt': 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem
                    onClick={(): void => {
                      popupState.close();
                      navigate('/signout', { replace: false });
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    {t('logout')}
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        )}
      </Stack>
    </Paper>
  );
});

export default Header;

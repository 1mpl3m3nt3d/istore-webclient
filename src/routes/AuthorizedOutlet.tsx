import 'reflect-metadata';

import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { LoadingSpinner } from 'components/LoadingSpinner';
import { IoCTypes, useInjection } from 'ioc';
import { User } from 'oidc-client-ts';
import { AuthStore } from 'stores';

const AuthorizedOutlet = observer(() => {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);

  useEffect(() => {
    const getAuthenticationStatus = async (): Promise<void> => {
      if (!(authStore.user instanceof User)) {
        await authStore.signinRedirect();
      }
    };

    getAuthenticationStatus().catch((error) => {
      console.log(error);
    });
  }, [authStore]);

  return authStore.user instanceof User ? <Outlet /> : <LoadingSpinner />;
});

export default AuthorizedOutlet;

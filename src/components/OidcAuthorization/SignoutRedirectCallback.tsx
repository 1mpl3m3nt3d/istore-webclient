import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { IoCTypes, useInjection } from 'ioc';
import { AuthStore } from 'stores';

function SignoutRedirectCallback(): JSX.Element {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);
  const navigate = useNavigate();

  useEffect(() => {
    const signoutRedirectCallback = async (): Promise<void> => {
      await authStore.signoutRedirectCallback(navigate);
    };

    signoutRedirectCallback().catch((error) => {
      console.log(error);
    });
  }, [authStore, navigate]);

  return <></>;
}

export default SignoutRedirectCallback;

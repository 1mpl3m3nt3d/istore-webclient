import { useEffect } from 'react';

import { IoCTypes, useInjection } from 'ioc';
import { useNavigate } from 'react-router-dom';
import { AuthStore } from 'stores';

function SigninRedirectCallback(): JSX.Element {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);
  const navigate = useNavigate();

  useEffect(() => {
    const signinRedirectCallback = async (): Promise<void> => {
      await authStore.signinRedirectCallback(navigate);
    };

    signinRedirectCallback().catch((error) => {
      console.log(error);
    });
  }, [authStore, navigate]);

  return <></>;
}

export default SigninRedirectCallback;

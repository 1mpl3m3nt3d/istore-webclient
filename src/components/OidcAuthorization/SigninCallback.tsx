import { useEffect } from 'react';

import { IoCTypes, useInjection } from 'ioc';
import { useNavigate } from 'react-router-dom';
import { AuthStore } from 'stores';

function SigninCallback(): JSX.Element {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);
  const navigate = useNavigate();

  useEffect(() => {
    const signinCallback = async (): Promise<void> => {
      await authStore.signinCallback(navigate);
    };

    signinCallback().catch((error) => {
      console.log(error);
    });
  }, [authStore, navigate]);

  return <></>;
}

export default SigninCallback;

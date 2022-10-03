import { useEffect } from 'react';

import { IoCTypes, useInjection } from 'ioc';
import { useNavigate } from 'react-router-dom';
import { AuthStore } from 'stores';

function SignoutCallback(): JSX.Element {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);
  const navigate = useNavigate();

  useEffect(() => {
    const signoutCallback = async (): Promise<void> => {
      await authStore.signoutCallback(navigate);
    };

    signoutCallback().catch((error) => {
      console.log(error);
    });
  }, [authStore, navigate]);

  return <></>;
}

export default SignoutCallback;

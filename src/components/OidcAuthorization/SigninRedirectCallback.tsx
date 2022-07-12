import { useEffect } from 'react';

import { IoCTypes, useInjection } from 'ioc';
import { AuthStore } from 'stores';

function SigninRedirectCallback(): JSX.Element {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);

  useEffect(() => {
    const signinRedirectCallback = async (): Promise<void> => {
      await authStore.signinRedirectCallback();
    };

    signinRedirectCallback().catch((error) => {
      console.log(error);
    });
  }, [authStore]);

  return <></>;
}

export default SigninRedirectCallback;

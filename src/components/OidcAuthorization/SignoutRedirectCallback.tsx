import { useEffect } from 'react';

import { IoCTypes, useInjection } from 'ioc';
import { AuthStore } from 'stores';

function SignoutRedirectCallback(): JSX.Element {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);

  useEffect(() => {
    const signoutRedirectCallback = async (): Promise<void> => {
      await authStore.signoutRedirectCallback();
    };

    signoutRedirectCallback().catch((error) => {
      console.log(error);
    });
  }, [authStore]);

  return <></>;
}

export default SignoutRedirectCallback;

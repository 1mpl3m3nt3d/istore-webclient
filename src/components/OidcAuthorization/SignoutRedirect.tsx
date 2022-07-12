import { useEffect } from 'react';

import { IoCTypes, useInjection } from 'ioc';
import { AuthStore } from 'stores';

function SignoutRedirect(): JSX.Element {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);

  useEffect(() => {
    const signoutRedirect = async (): Promise<void> => {
      await authStore.signoutRedirect();
    };

    signoutRedirect().catch((error) => {
      console.log(error);
    });
  }, [authStore]);

  return <></>;
}

export default SignoutRedirect;

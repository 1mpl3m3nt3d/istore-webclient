import { useEffect } from 'react';

import { IoCTypes, useInjection } from 'ioc';
import { AuthStore } from 'stores';

function SigninCallback(): JSX.Element {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);

  useEffect(() => {
    const signinCallback = async (): Promise<void> => {
      await authStore.signinCallback();
    };

    signinCallback().catch((error) => {
      console.log(error);
    });
  }, [authStore]);

  return <></>;
}

export default SigninCallback;

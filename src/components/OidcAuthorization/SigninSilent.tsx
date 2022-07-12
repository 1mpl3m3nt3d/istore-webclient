import { useEffect } from 'react';

import { IoCTypes, useInjection } from 'ioc';
import { AuthStore } from 'stores';

function SigninSilent(): JSX.Element {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);

  useEffect(() => {
    const signinSilent = async (): Promise<void> => {
      await authStore.signinSilent();
    };

    signinSilent().catch((error) => {
      console.log(error);
    });
  }, [authStore]);

  return <></>;
}

export default SigninSilent;

import { useEffect } from 'react';

import { IoCTypes, useInjection } from 'ioc';
import { AuthStore } from 'stores';

function SignoutCallback(): JSX.Element {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);

  useEffect(() => {
    const signoutCallback = async (): Promise<void> => {
      await authStore.signoutCallback();
    };

    signoutCallback().catch((error) => {
      console.log(error);
    });
  }, [authStore]);

  return <></>;
}

export default SignoutCallback;

import { useEffect } from 'react';

import { IoCTypes, useInjection } from 'ioc';
import { AuthStore } from 'stores';

function SigninPopupCallback(): JSX.Element {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);

  useEffect(() => {
    const signinPopupCallback = async (): Promise<void> => {
      await authStore.signinPopupCallback();
    };

    signinPopupCallback().catch((error) => {
      console.log(error);
    });
  }, [authStore]);

  return <></>;
}

export default SigninPopupCallback;

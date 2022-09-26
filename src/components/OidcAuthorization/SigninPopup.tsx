import { useEffect } from 'react';

import { IoCTypes, useInjection } from 'ioc';
import { AuthStore } from 'stores';

function SigninPopup(): JSX.Element {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);

  useEffect(() => {
    const signinPopup = async (): Promise<void> => {
      await authStore.signinPopup();
    };

    signinPopup().catch((error) => {
      console.log(error);
    });
  }, [authStore, authStore.user]);

  return <></>;
}

export default SigninPopup;

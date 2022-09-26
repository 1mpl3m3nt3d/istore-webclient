import { useEffect } from 'react';

import { IoCTypes, useInjection } from 'ioc';
import { AuthStore } from 'stores';

function SignoutPopup(): JSX.Element {
  const authStore = useInjection<AuthStore>(IoCTypes.authStore);

  useEffect(() => {
    const signoutPopup = async (): Promise<void> => {
      await authStore.signoutPopup();
    };

    signoutPopup().catch((error) => {
      console.log(error);
    });
  }, [authStore]);

  return <></>;
}

export default SignoutPopup;

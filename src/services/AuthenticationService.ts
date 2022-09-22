import 'reflect-metadata';

import { injectable } from 'inversify';
import { Log, SignoutResponse, User, UserManager } from 'oidc-client-ts';

import { OidcConfig } from 'utils';

export interface AuthenticationService {
  clearStaleState: () => Promise<void>;
  getAuthenticationStatus: () => boolean;
  getUser: () => Promise<User | null>;
  parseJwt: (token: string) => unknown;
  signinPopup: () => Promise<User | undefined>;
  signinPopupCallback: () => Promise<void>;
  signinRedirect: () => Promise<void>;
  signinRedirectCallback: () => Promise<User | undefined>;
  signinSilent: () => Promise<User | null>;
  signinSilentCallback: () => Promise<void>;
  signoutPopup: () => Promise<void>;
  signoutPopupCallback: () => Promise<void>;
  signoutRedirect: () => Promise<void>;
  signoutRedirectCallback: () => Promise<SignoutResponse>;
  startSilentRenew: () => void;
  stopSilentRenew: () => void;
}

@injectable()
export default class DefaultAuthenticationService implements AuthenticationService {
  private readonly userManager: UserManager;

  constructor() {
    this.userManager = new UserManager(OidcConfig);
    this.configUserManager();
    Log.setLogger(console);
    Log.setLevel(Log.WARN);
  }

  public configUserManager = (): void => {
    this.userManager.events.addSilentRenewError(function (err) {
      console.log(`SilentRenew Error:\n${err.name}\n${err.message}\n${err.cause}`);
    });

    this.userManager.events.addUserSignedIn(function () {
      console.log('User signed in!');
    });

    this.userManager.events.addUserSignedOut(function () {
      console.log('User logged out!');
    });

    this.userManager.events.addUserLoaded(function (user) {
      console.log(`User loaded:\n${user.profile.sub}`);
    });

    this.userManager.events.addUserUnloaded(function () {
      console.log('User unloaded');
    });
  };

  public clearStaleState = async (): Promise<void> => {
    await this.userManager.clearStaleState().catch((error) => {
      console.log(error);
    });
  };

  public getAuthenticationStatus = (): boolean => {
    const oidcUser = JSON.parse(
      String(
        sessionStorage.getItem(
          `oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_IDENTITY_CLIENT_ID}`
        )
      )
    );

    return !!oidcUser && !!oidcUser.id_token;
  };

  public getUser = async (): Promise<User | null> => {
    return await this.userManager.getUser();
  };

  public parseJwt = (token: string): unknown => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');

    return JSON.parse(window.atob(base64));
  };

  public signinPopup = async (): Promise<User | undefined> => {
    return (await this.userManager.signinPopup()) ?? undefined;
  };

  public signinPopupCallback = async (): Promise<void> => {
    return await this.userManager.signinPopupCallback();
  };

  public signinRedirect = async (): Promise<void> => {
    await this.userManager.signinRedirect().catch((error) => {
      console.log(error);
    });
  };

  public signinRedirectCallback = async (): Promise<User | undefined> => {
    return (await this.userManager.signinRedirectCallback()) ?? undefined;
  };

  public signinSilent = async (): Promise<User | null> => {
    return await this.userManager.signinSilent();
  };

  public signinSilentCallback = async (): Promise<void> => {
    return await this.userManager.signinSilentCallback();
  };

  public signoutPopup = async (): Promise<void> => {
    await this.userManager.signoutPopup().catch((error) => {
      console.log(error);
    });
  };

  public signoutPopupCallback = async (): Promise<void> => {
    await this.userManager.signoutPopupCallback().catch((error) => {
      console.log(error);
    });
  };

  public signoutRedirect = async (): Promise<void> => {
    await this.userManager
      .signoutRedirect({
        id_token_hint: localStorage.getItem('id_token') ?? undefined,
      })
      .catch((error) => {
        console.log(error);
      });
  };

  public signoutRedirectCallback = async (): Promise<SignoutResponse> => {
    return await this.userManager.signoutRedirectCallback();
  };

  public startSilentRenew = (): void => {
    this.userManager.startSilentRenew();
  };

  public stopSilentRenew = (): void => {
    this.userManager.stopSilentRenew();
  };
}

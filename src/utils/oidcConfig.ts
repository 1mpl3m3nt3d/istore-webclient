import { Log, UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';

Log.setLogger(console);
Log.setLevel(Log.INFO);

export const oidcConfig: UserManagerSettings = {
  accessTokenExpiringNotificationTimeInSeconds: 60,
  authority: `${process.env.REACT_APP_IDENTITY_URL}`,
  automaticSilentRenew: true,
  client_authentication: 'client_secret_post',
  client_id: `${process.env.REACT_APP_CLIENT_ID}`,
  client_secret: `${process.env.REACT_APP_CLIENT_SECRET}`,
  filterProtocolClaims: true,
  includeIdTokenInSilentRenew: true,
  loadUserInfo: true,
  mergeClaims: false,
  monitorAnonymousSession: false,
  monitorSession: false,
  post_logout_redirect_uri: `${process.env.REACT_APP_POST_LOGOUT_REDIRECT_URL}`,
  //prompt: 'login',
  redirect_uri: `${process.env.REACT_APP_REDIRECT_URL}`,
  redirectMethod: 'assign',
  refreshTokenCredentials: 'include',
  response_mode: 'query',
  response_type: `${process.env.REACT_APP_RESPONSE_TYPE}`,
  revokeTokensOnSignout: true,
  revokeTokenTypes: ['access_token', 'refresh_token'],
  scope: `${process.env.REACT_APP_SCOPE}`,
  silent_redirect_uri: `${process.env.REACT_APP_SILENT_REDIRECT_URL}`,
  silentRequestTimeoutInSeconds: 15,
  staleStateAgeInSeconds: 300,
  stateStore: new WebStorageStateStore({ store: window.sessionStorage }),
  stopCheckSessionOnError: true,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  validateSubOnSilentRenew: true,
};

export default oidcConfig;

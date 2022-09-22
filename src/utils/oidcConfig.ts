import { UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';

export const oidcConfig: UserManagerSettings = {
  authority: `${process.env.REACT_APP_IDENTITY_URL}`,
  automaticSilentRenew: true,
  client_authentication: 'client_secret_post',
  client_id: `${process.env.REACT_APP_CLIENT_ID}`,
  client_secret: `${process.env.REACT_APP_CLIENT_SECRET}`,
  filterProtocolClaims: true,
  includeIdTokenInSilentRenew: true,
  loadUserInfo: true,
  post_logout_redirect_uri: `${process.env.REACT_APP_POST_LOGOUT_REDIRECT_URL}`,
  prompt: 'login',
  redirect_uri: `${process.env.REACT_APP_REDIRECT_URL}`,
  response_type: `${process.env.REACT_APP_RESPONSE_TYPE}`,
  scope: `${process.env.REACT_APP_SCOPE}`,
  silent_redirect_uri: `${process.env.REACT_APP_SILENT_REDIRECT_URL}`,
  silentRequestTimeoutInSeconds: 15,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  validateSubOnSilentRenew: true,
};

export default oidcConfig;

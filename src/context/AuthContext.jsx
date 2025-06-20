import { AuthProvider as OidcProvider, useAuth as useOidc } from "react-oidc-context";

const oidcConfig = {
  authority: import.meta.env.REACT_APP_IDENTITY_SERVER_URL,
  client_id: import.meta.env.REACT_APP_CLIENT_ID,
  client_secret: import.meta.env.REACT_APP_CLIENT_SECRET,
  redirect_uri: `${window.location.origin}/signin-callback`,
  response_type: "code",
  scope: "openid roles api_read_scope api_write_scope",
  onSigninCallback: (user) => {
    if (user?.access_token) {
      localStorage.setItem("token", user.access_token);
    }
    window.location.replace("/");
  },
};

export const AuthProvider = ({ children }) => (
  <OidcProvider {...oidcConfig}>{children}</OidcProvider>
);

export const useAuth = useOidc;

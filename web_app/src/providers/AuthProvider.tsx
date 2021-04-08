import React, { useEffect } from 'react';
import axios from 'axios';

// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

interface OidcOptions {
  providerName: string;
  helpText?: string;
}

interface Auth {
  loading: boolean;
  signedIn: boolean;
  mode?: 'oidc' | 'local';
  oidc?: OidcOptions;
  csrfToken?: string;
}

const AuthStateContext = React.createContext<Auth | undefined>(undefined);
const AuthDispatchContext = React.createContext<
  React.Dispatch<any> | undefined
>(undefined);

type AuthAction =
  | { type: 'login' }
  | { type: 'logout' }
  | { type: 'useLocalAuth' }
  | { type: 'useOidcAuth'; payload: OidcOptions }
  | { type: 'csrfToken'; payload: string };

function authReducer(state: Auth, action: AuthAction): Auth {
  switch (action.type) {
    case 'login': {
      return { ...state, signedIn: true, loading: false };
    }
    case 'logout': {
      return { ...state, signedIn: false, loading: false };
    }
    case 'csrfToken': {
      return { ...state, csrfToken: action.payload };
    }
    case 'useLocalAuth': {
      return { ...state, mode: 'local' };
    }
    case 'useOidcAuth': {
      return { ...state, mode: 'oidc', oidc: action.payload };
    }
  }
}

export function useAuthState() {
  const context = React.useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }
  return context;
}

export function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  initialState?: Auth;
}

export function AuthProvider({
  initialState,
  children,
}: React.PropsWithChildren<AuthProviderProps>) {
  const [state, dispatch] = React.useReducer(
    authReducer,
    initialState || {
      signedIn: false,
      loading: true,
    }
  );
  const loading = state.loading;

  useEffect(() => {
    if (loading) {
      let done = false;
      // Call server to check authentication status
      axios.get('/auth').then(({ data }) => {
        if (!done) {
          document.cookie = `XSRF-TOKEN=${data.csrfToken}; path=/`; // Axios uses this cookie
          dispatch({ type: 'csrfToken', payload: data.csrfToken });
          dispatch({
            type: data.signedIn ? 'login' : 'logout',
          });
          if (data.mode === 'oidc') {
            dispatch({
              type: 'useOidcAuth',
              payload: data.oidc,
            });
          } else {
            dispatch({ type: 'useLocalAuth' });
          }
        }
      });
      return () => {
        done = true;
      };
    }
  }, [loading]);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {loading ? null : children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

import jwt_decode from 'jwt-decode';
import { useContext, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ChainlitContext } from 'src/context';
import {
  accessTokenState,
  authState,
  threadHistoryState,
  userState,
  widgetConfigState
} from 'src/state';
import { IAuthConfig, IUser } from 'src/types';
import { getToken, removeToken, setToken } from 'src/utils/token';

import { useApi } from './api';

export const useAuth = () => {
  const apiClient = useContext(ChainlitContext);
  const [authConfig, setAuthConfig] = useRecoilState(authState);
  const [user, setUser] = useRecoilState(userState);
  const { data, isLoading } = useApi<IAuthConfig>(
    authConfig ? null : '/auth/config'
  );

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const setThreadHistory = useSetRecoilState(threadHistoryState);
  const widgetConfig = useRecoilValue(widgetConfigState);
  useEffect(() => {
    if (!data) return;
    setAuthConfig(data);
    console.log(widgetConfig?.chatBotID);

    if (widgetConfig?.chatBotID) {
      apiClient
        .post('/chatbot', { chatbotId: widgetConfig.chatBotID })
        .then((response) => response.json())
        .then((data) => {
          console.log('Chatbot data:', data);
          // Handle the chatbot data as needed
        })
        .catch((error) => {
          console.error('Error fetching chatbot data:', error);
        });
    }
  }, [setAuthConfig, widgetConfig, apiClient]);

  const isReady = !!(!isLoading && authConfig);

  const logout = async (reload = false) => {
    await apiClient.logout();
    setUser(null);
    removeToken();
    setAccessToken('');
    setThreadHistory(undefined);
    console.log(widgetConfig?.chatBotID, 'chatBotID');
    if (reload) {
      window.location.reload();
    }
  };

  const saveAndSetToken = (token: string | null | undefined) => {
    if (!token) {
      logout();
      return;
    }
    try {
      const { exp, ...User } = jwt_decode(token) as any;
      setToken(token);
      setAccessToken(`Bearer ${token}`);
      setUser(User as IUser);
    } catch (e) {
      console.error(
        'Invalid token, clearing token from local storage',
        'error:',
        e
      );
      logout();
    }
  };

  useEffect(() => {
    if (!user && getToken()) {
      // Initialize the token from local storage
      saveAndSetToken(getToken());
      return;
    }
  }, []);

  const isAuthenticated = !!accessToken;

  if (authConfig && !authConfig.requireLogin) {
    return {
      authConfig,
      user: null,
      isReady,
      isAuthenticated: true,
      accessToken: '',
      logout: () => {},
      setAccessToken: () => {}
    };
  }

  return {
    data: authConfig,
    user: user,
    isAuthenticated,
    isReady,
    accessToken: accessToken,
    logout: logout,
    setAccessToken: saveAndSetToken
  };
};

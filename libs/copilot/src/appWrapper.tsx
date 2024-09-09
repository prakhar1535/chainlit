import { makeApiClient } from 'api';
import App from 'app';
import { WidgetContext } from 'context';
import { useEffect } from 'react';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { IWidgetConfig } from 'types';

import { i18nSetupLocalization } from '@chainlit/app/src/i18n';
import { ChainlitContext } from '@chainlit/react-client';
import { widgetConfigState } from '@chainlit/react-client/src';

i18nSetupLocalization();

interface Props {
  widgetConfig: IWidgetConfig;
  initialMessage?: string | undefined;
  status?: string | undefined;
}

export default function AppWrapper({
  widgetConfig,
  initialMessage,
  status
}: Props) {
  const apiClient = makeApiClient(widgetConfig.chainlitServer);

  return (
    <ChainlitContext.Provider value={apiClient}>
      <RecoilRoot>
        <AppContent
          widgetConfig={widgetConfig}
          initialMessage={initialMessage}
          status={status}
        />
      </RecoilRoot>
    </ChainlitContext.Provider>
  );
}

function AppContent({ widgetConfig, initialMessage, status }: Props) {
  const setWidgetConfig = useSetRecoilState(widgetConfigState);

  useEffect(() => {
    setWidgetConfig(widgetConfig);
  }, [widgetConfig, setWidgetConfig]);

  return (
    <WidgetContext.Provider
      value={{
        accessToken: widgetConfig.accessToken,
        initialMessage,
        status
      }}
    >
      <App
        widgetConfig={widgetConfig}
        initialMessage={initialMessage}
        status={status}
      />
    </WidgetContext.Provider>
  );
}

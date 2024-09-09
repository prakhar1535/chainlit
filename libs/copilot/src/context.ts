import { createContext } from 'react';

interface IWidgetContext {
  accessToken?: string;
  initialMessage?: string;
  status?: boolean | undefined;
}

const defaultContext = {
  accessToken: undefined
};

const WidgetContext = createContext<IWidgetContext>(defaultContext);

export { WidgetContext, defaultContext };

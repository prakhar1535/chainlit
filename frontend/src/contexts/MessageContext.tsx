import { createContext } from 'react';

import { IMessageContext } from 'types/messageContext';

const defaultMessageContext = {
  avatars: [],
  defaultCollapseContent: false,
  highlightedMessage: null,
  loading: false,
  onElementRefClick: undefined,
  onFeedbackUpdated: undefined,
  showFeedbackButtons: false,
  onError: () => undefined,
  uiName: ''
};

const MessageContext = createContext<IMessageContext>(defaultMessageContext);

export { MessageContext, defaultMessageContext };

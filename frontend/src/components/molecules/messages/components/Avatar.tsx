// import { useContext, useMemo } from 'react';
import { Box, Tooltip } from '@mui/material';

// import Avatar from '@mui/material/Avatar';
// import {
//   ChainlitContext,
//   useChatSession,
//   useConfig
// } from '@chainlit/react-client';
// import Logo from '../../../../assets/gLogo.jpeg';

interface Props {
  author?: string;
  hide?: boolean;
}

const MessageAvatar = ({ author }: Props) => {
  // const apiClient = useContext(ChainlitContext);
  // const { chatProfile } = useChatSession();
  // const { config } = useConfig();

  // const selectedChatProfile = useMemo(() => {
  //   return config?.chatProfiles.find((profile) => profile.name === chatProfile);
  // }, [config, chatProfile]);

  // const avatarUrl = useMemo(() => {
  //   const isAssistant = !author || author === 'Galadon';
  //   if (isAssistant && selectedChatProfile?.icon) {
  //     return Logo;
  //   }
  //   return apiClient?.buildEndpoint(`/avatars/${author || 'default'}`);
  // }, [apiClient, selectedChatProfile, config, author]);

  return (
    <span
      className={`message-avatar`}
      style={{
        paddingTop: '12px'
      }}
    >
      <Tooltip title={author}>
        <Box
          component={'img'}
          src={
            'https://res.cloudinary.com/dvv44upa0/image/upload/v1724088690/xvvolyzavi6vrxg96a0a.png'
          }
          sx={{
            borderRadius: '10000px',

            width: '1.5rem',
            height: '1.5rem'
          }}
        />
      </Tooltip>
    </span>
  );
};

export { MessageAvatar };

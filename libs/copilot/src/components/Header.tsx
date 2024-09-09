import { IWidgetConfig } from 'types';

import { Stack } from '@mui/material';

import ChatProfiles from './ChatProfiles';
import NewChatButton from './NewChatButton';

interface headerProps {
  themeColor: string;
  avatarUrl?: string;
}
const Header: React.FC<headerProps> = ({
  themeColor,
  avatarUrl
}): JSX.Element => (
  <Stack
    px={2}
    py={1.5}
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    bgcolor={themeColor !== '' ? themeColor : 'background.paper'}
  >
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {/* <Logo style={{ maxHeight: '25px' }} /> */}

      <img
        src={
          avatarUrl !== ''
            ? avatarUrl
            : 'https://res.cloudinary.com/dvv44upa0/image/upload/v1724088690/xvvolyzavi6vrxg96a0a.png'
        }
        style={{
          maxHeight: '25px',
          borderRadius: '50%'
        }}
      />
      {/* <IconButton onClick={() => setExpanded(!expanded)}>
        {expanded ? (
          <MinimizeIcon sx={{ width: 16, height: 16 }} />
        ) : (
          <ExpandIcon sx={{ width: 16, height: 16 }} />
        )}
      </IconButton> */}
    </Stack>
    <Stack direction="row" alignItems="center" spacing={1}>
      <ChatProfiles />
      <NewChatButton />
    </Stack>
  </Stack>
);

export default Header;

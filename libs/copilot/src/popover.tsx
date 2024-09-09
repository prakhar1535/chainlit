import Chat from 'chat';

// import { useState } from 'react';
import { Box } from '@mui/material';
import Fade from '@mui/material/Fade';
import Popper from '@mui/material/Popper';

import Header from 'components/Header';

interface Props {
  anchorEl?: HTMLElement | null;
  buttonHeight: string;
  popoverBackground: string;
  themeColor: string;
  avatarUrl: string;
  hideFeedback: boolean;
  fontColor: string;
  initialMessage: string;
  status: boolean;
}

export default function PopOver({
  anchorEl,
  buttonHeight,
  popoverBackground,
  themeColor,
  avatarUrl,
  hideFeedback,
  fontColor,
  initialMessage,
  status
}: Props) {
  // const [expanded, setExpanded] = useState(false);
  return (
    <Popper
      id="chainlit-copilot-popover"
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement="top"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        inset: {
          sm: 'auto auto 14px -24px !important',
          xs: 'auto 0 14px 0px !important'
        },
        height: `min(730px, calc(100vh - ${buttonHeight} - 48px))`,
        width: { sm: '400px', xs: '100%' },
        overflow: 'hidden',
        borderRadius: '12px',
        background: popoverBackground === '' ? 'white' : popoverBackground,
        boxShadow:
          '0 6px 6px 0 rgba(0,0,0,.02),0 8px 24px 0 rgba(0,0,0,.12)!important',
        zIndex: 1000
      }}
    >
      <Fade in={!!anchorEl}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%'
          }}
        >
          <Header themeColor={themeColor} avatarUrl={avatarUrl} />
          <Chat
            status={status}
            initialMessage={initialMessage}
            fontColor={fontColor}
            hideFeedback={hideFeedback}
            themeColor={themeColor}
          />
        </Box>
      </Fade>
    </Popper>
  );
}

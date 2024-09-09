import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import { Alert, Box, Typography } from '@mui/material';

import { ErrorBoundary } from '@chainlit/app/src/components/atoms/ErrorBoundary';
import ScrollContainer from '@chainlit/app/src/components/molecules/messages/ScrollContainer';
import { TaskList } from '@chainlit/app/src/components/molecules/tasklist/TaskList';
import DropScreen from '@chainlit/app/src/components/organisms/chat/dropScreen';
import ChatSettingsModal from '@chainlit/app/src/components/organisms/chat/settings';
import WelcomeScreen from '@chainlit/app/src/components/organisms/chat/welcomeScreen';
import { useUpload } from '@chainlit/app/src/hooks';
import { IAttachment, attachmentsState } from '@chainlit/app/src/state/chat';
import {
  // IStep,
  threadHistoryState,
  useChatData,
  useChatInteract,
  useConfig
} from '@chainlit/react-client';
import { sideViewState } from '@chainlit/react-client';

import { ElementSideView } from 'components/ElementSideView';
import { InputBox } from 'components/InputBox';

import Messages from './messages';

interface Props {
  themeColor: string;
  hideFeedback: boolean;
  fontColor: string;
  initialMessage: string;
  status: false;
}
const Chat: React.FC<Props> = ({
  themeColor,
  hideFeedback,
  fontColor,
  // initialMessage,
  status
}) => {
  const { config } = useConfig();
  const setAttachments = useSetRecoilState(attachmentsState);
  const setThreads = useSetRecoilState(threadHistoryState);
  const [sideViewElement, setSideViewElement] = useRecoilState(sideViewState);
  const [autoScroll, setAutoScroll] = useState(true);
  const { error, disabled, callFn } = useChatData();
  const { uploadFile } = useChatInteract();
  const uploadFileRef = useRef(uploadFile);
  // const initialMessageSentRef = useRef(false);

  // useEffect(() => {
  //   if (initialMessage && !initialMessageSentRef.current && status) {
  //     const message: IStep = {
  //       threadId: '',
  //       id: uuidv4(),
  //       name: 'Assistant',
  //       type: 'assistant_message',
  //       output: initialMessage,
  //       createdAt: new Date().toISOString()
  //     };
  //     const sendInitialMessage = async () => {
  //       try {
  //         await sendMessage(message, []);
  //         initialMessageSentRef.current = true;
  //       } catch (error: any) {
  //         console.error('Failed to send initial message:', error);
  //         toast.error(
  //           'Failed to send initial message. Please try refreshing the page.'
  //         );
  //       }
  //     };
  //     sendInitialMessage();
  //   }
  // }, [initialMessage, sendMessage]);
  const fileSpec = useMemo(
    () => ({
      max_size_mb:
        config?.features?.spontaneous_file_upload?.max_size_mb || 500,
      max_files: config?.features?.spontaneous_file_upload?.max_files || 20,
      accept: config?.features?.spontaneous_file_upload?.accept || ['*/*']
    }),
    [config]
  );

  useEffect(() => {
    if (callFn) {
      const event = new CustomEvent('chainlit-call-fn', {
        detail: callFn
      });
      window.dispatchEvent(event);
    }
  }, [callFn]);

  useEffect(() => {
    uploadFileRef.current = uploadFile;
  }, [uploadFile]);

  const onFileUpload = useCallback(
    (payloads: File[]) => {
      const attachements: IAttachment[] = payloads.map((file) => {
        const id = uuidv4();

        const { xhr, promise } = uploadFileRef.current(file, (progress) => {
          setAttachments((prev) =>
            prev.map((attachment) => {
              if (attachment.id === id) {
                return {
                  ...attachment,
                  uploadProgress: progress
                };
              }
              return attachment;
            })
          );
        });

        promise
          .then((res) => {
            setAttachments((prev) =>
              prev.map((attachment) => {
                if (attachment.id === id) {
                  return {
                    ...attachment,
                    // Update with the server ID
                    serverId: res.id,
                    uploaded: true,
                    uploadProgress: 100,
                    cancel: undefined
                  };
                }
                return attachment;
              })
            );
          })
          .catch((error) => {
            toast.error(`Failed to upload ${file.name}: ${error.message}`);
            setAttachments((prev) =>
              prev.filter((attachment) => attachment.id !== id)
            );
          });

        return {
          id,
          type: file.type,
          name: file.name,
          size: file.size,
          uploadProgress: 0,
          cancel: () => {
            toast.info(`Cancelled upload of ${file.name}`);
            xhr.abort();
            setAttachments((prev) =>
              prev.filter((attachment) => attachment.id !== id)
            );
          },
          remove: () => {
            setAttachments((prev) =>
              prev.filter((attachment) => attachment.id !== id)
            );
          }
        };
      });
      setAttachments((prev) => prev.concat(attachements));
    },
    [uploadFile]
  );

  const onFileUploadError = useCallback(
    (error: string) => toast.error(error),
    [toast]
  );

  const upload = useUpload({
    spec: fileSpec,
    onResolved: onFileUpload,
    onError: onFileUploadError,
    options: { noClick: true }
  });

  useEffect(() => {
    setThreads((prev) => ({
      ...prev,
      currentThreadId: undefined
    }));
  }, []);

  const enableMultiModalUpload =
    !disabled && config?.features?.spontaneous_file_upload?.enabled;

  return (
    <Box
      {...(enableMultiModalUpload
        ? upload?.getRootProps({ className: 'dropzone' })
        : {})}
      // Disable the onFocus and onBlur events in react-dropzone to avoid interfering with child trigger events
      onBlur={undefined}
      onFocus={undefined}
      display="flex"
      width="100%"
      flexGrow={1}
      overflow="auto"
    >
      {upload ? (
        <>
          <input id="#upload-drop-input" {...upload.getInputProps()} />
          {upload?.isDragActive ? <DropScreen /> : null}
        </>
      ) : null}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          height: '100%'
        }}
      >
        {error ? (
          <Box
            sx={{
              width: '100%',
              mx: 'auto',
              my: 2
            }}
          >
            <Alert sx={{ mx: 2 }} id="session-error" severity="error">
              Could not reach the server.
            </Alert>
          </Box>
        ) : (
          <Box mt={1} />
        )}
        <ChatSettingsModal />
        <TaskList isMobile={true} />
        <ErrorBoundary>
          <ScrollContainer
            autoScroll={autoScroll}
            setAutoScroll={setAutoScroll}
          >
            <WelcomeScreen hideLogo />
            <Box my={1} />
            <Messages
              fontColor={fontColor}
              hideFeedback={hideFeedback}
              themeColor={themeColor}
            />
          </ScrollContainer>
          {status ? (
            <InputBox
              fileSpec={fileSpec}
              onFileUpload={onFileUpload}
              onFileUploadError={onFileUploadError}
              autoScroll={autoScroll}
              setAutoScroll={setAutoScroll}
              themeColor={themeColor}
            />
          ) : (
            <Typography
              sx={{
                alignSelf: 'center',
                textAlign: 'center',
                marginBottom: '20px'
              }}
            >
              There is some payment issue please contact administrator
            </Typography>
          )}
        </ErrorBoundary>
      </Box>
      <ElementSideView
        onClose={() => setSideViewElement(undefined)}
        isOpen={!!sideViewElement}
        element={sideViewElement}
      />
    </Box>
  );
};

export default Chat;

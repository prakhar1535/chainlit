export interface IWidgetConfig {
  chatBotID?: string;
  chainlitServer: string;
  botName?: string;
  showCot?: boolean;
  accessToken?: string;
  popoverBackground?: string | undefined;
  theme?: 'light' | 'dark';
  fontFamily?: string;
  themeColor?: string | undefined;
  hideFeedback?: boolean;
  avatarUrl?: string | undefined;
  fontColor?: string | undefined;
  status?: boolean;
  initialMessage?: string;
  button?: {
    containerId?: string;
    imageUrl?: string;
    style?: {
      size?: string;
      width?: string;
      height?: string;
      bgcolor?: string;
      color?: string;
      bgcolorHover?: string;
      borderColor?: string;
      borderWidth?: string;
      borderStyle?: string;
      borderRadius?: string;
      boxShadow?: string;
    };
  };
}

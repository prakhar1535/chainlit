import type { Meta, StoryObj } from '@storybook/react';
import AppWrapper from 'appWrapper';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/App',
  component: AppWrapper,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {}
} satisfies Meta<typeof AppWrapper>;

export default meta;
type Story = StoryObj<typeof AppWrapper>;
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    widgetConfig: {
      chainlitServer: 'http://0.0.0.0:8066/chainlit',
      theme: 'light',
      fontFamily: '"Nunito Sans"',
      themeColor: 'blue',
      fontColor: 'white',
      chatBotID: 'b0171ab3-4b52-43e5-9742-cba4fb70a9f4',
      status: false,
      initialMessage: 'Hey, how are you?'
    }
  },
  loaders: [
    async () => {
      try {
        const response = await fetch(
          'http://backend.galadon.jeemstudio.com/get-sessions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              chatbotId: 'b0171ab3-4b52-43e5-9742-cba4fb70a9f4'
            })
          }
        );
        const data = await response.json();
        return { initialMessage: data.initialMessage, status: data.status };
      } catch (error) {
        console.error('Error fetching initial message:', error);
        return {
          initialMessage: 'Failed to load initial message',
          status: 'error'
        };
      }
    }
  ]
};

export const Secondary: Story = {
  args: {
    widgetConfig: {
      chainlitServer: 'http://0.0.0.0:8066/chainlit',
      theme: 'dark',
      fontFamily: '"Nunito Sans"',

      button: {
        imageUrl:
          'https://steelbluemedia.com/wp-content/uploads/2019/06/new-google-favicon-512.png',
        style: {
          bgcolor: 'transparent',
          bgcolorHover: 'transparent',
          color: 'black'
        }
      }
    }
  }
};

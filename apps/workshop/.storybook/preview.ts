import type { Preview } from '@storybook/react';
import { withScreenshot } from 'storycap';
import '../src/index.css';



const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    withScreenshot,
  ]
};

export default preview;

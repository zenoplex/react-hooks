import type { Preview } from '@storybook/react';
import { withScreenshot } from 'storycap';
import '../src/index.css';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { handlers } from '../mocks/handlers';

// Initialize MSW
initialize();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    msw: {
      handlers: {
        test: handlers,
      },
    },
  },
  decorators: [
    // @ts-expect-error storycap types are not up to date
    withScreenshot,
  ],
  loaders: [mswLoader],
};

export default preview;

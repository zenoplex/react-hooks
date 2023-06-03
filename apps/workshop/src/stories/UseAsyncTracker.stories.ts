import type { Meta, StoryObj } from '@storybook/react';

import { UseAsyncTracker } from './UseAsyncTracker';

const meta = {
  component: UseAsyncTracker,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof UseAsyncTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

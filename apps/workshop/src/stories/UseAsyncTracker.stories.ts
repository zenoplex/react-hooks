import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

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

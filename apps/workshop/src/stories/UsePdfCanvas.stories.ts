import type { Meta, StoryObj } from '@storybook/react';

import { UsePdfCanvas } from './UsePdfCanvas';

const meta = {
  component: UsePdfCanvas,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof UsePdfCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

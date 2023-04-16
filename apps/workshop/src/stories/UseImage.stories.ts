import type { Meta, StoryObj } from '@storybook/react';

import { UseImage } from './UseImage';

const meta = {
  component: UseImage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof UseImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

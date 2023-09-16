import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { UseImage } from './UseImage';

const meta = {
  component: UseImage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof UseImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('load'));
    await waitFor(() => {
      expect(canvas.getByAltText('image'));
    });
  },
};

export const Error: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByLabelText('url'));
    await userEvent.click(canvas.getByText('load'));
    await waitFor(async () => {
      await expect(canvas.getByTestId('result').textContent).toBe('error');
    });
  },
};

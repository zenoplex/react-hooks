import type { Meta, StoryObj } from '@storybook/react';

import { userEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { UseAsyncTracker } from './UseAsyncTracker';
import { sleep } from './sleep';

const meta = {
  component: UseAsyncTracker,
} satisfies Meta<typeof UseAsyncTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await sleep();
    const canvas = within(canvasElement);

    await expect(canvas.getByTestId('global-count').textContent).toBe(
      'Global count: 0'
    );
    await expect(canvas.getByTestId('other-count').textContent).toBe(
      'Other count: 0'
    );

    await userEvent.click(canvas.getByText('load other 2'));
    await waitFor(async () => {
      await expect(canvas.getByTestId('other-count').textContent).toBe(
        'Other count: 1'
      );
      await expect(canvas.getByText('loading...')).toBeDisabled();
    });
    await waitFor(
      async () => {
        await expect(canvas.getByTestId('other-count').textContent).toBe(
          'Other count: 0'
        );
      },
      { timeout: 5000 }
    );

    await userEvent.click(canvas.getByText('load global'));
    await waitFor(async () => {
      await expect(canvas.getByTestId('global-count').textContent).toBe(
        'Global count: 1'
      );
      await expect(canvas.getByText('loading...')).toBeDisabled();
    });
    await waitFor(
      async () => {
        await expect(canvas.getByTestId('global-count').textContent).toBe(
          'Global count: 0'
        );
      },
      { timeout: 5000 }
    );
  },
};

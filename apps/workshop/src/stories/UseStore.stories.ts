import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { sleep } from './sleep';
import { UseStore } from './UseStore';

const meta = {
  component: UseStore,
} satisfies Meta<typeof UseStore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    await sleep();
    const canvas = within(canvasElement);

    await expect(canvas.getByTestId('global-count').textContent).toBe(
      'Global count: 0'
    );
    await expect(canvas.getByTestId('other-count').textContent).toBe(
      'Other count: 0'
    );

    await step('increment other', async () => {
      await userEvent.click(canvas.getByText('load other 2'));
      await expect(canvas.getByTestId('other-count').textContent).toBe(
        'Other count: 1'
      );

      await userEvent.click(canvas.getByText('load other 2'));
      await expect(canvas.getByTestId('other-count').textContent).toBe(
        'Other count: 2'
      );
    });

    await step('increment global', async () => {
      await userEvent.click(canvas.getByText('load global 2'));
      await expect(canvas.getByTestId('global-count').textContent).toBe(
        'Global count: 1'
      );

      await userEvent.click(canvas.getByText('load global 2'));
      await expect(canvas.getByTestId('global-count').textContent).toBe(
        'Global count: 2'
      );
    });
  },
};

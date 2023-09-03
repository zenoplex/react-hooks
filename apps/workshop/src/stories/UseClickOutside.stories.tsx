import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import { expect, jest } from '@storybook/jest';
import { UseClickOutside } from './UseClickOutside';

const meta = {
  component: UseClickOutside,
} satisfies Meta<typeof UseClickOutside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const alertFn = jest.spyOn(window, 'alert').mockImplementation(() => {});
    alertFn.mockClear();

    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'parent' }));
    expect(alertFn).toHaveBeenCalledWith('clicked outside');
    alertFn.mockClear();

    await userEvent.click(canvas.getByRole('button', { name: 'outside' }));
    expect(alertFn).toHaveBeenCalledWith('clicked outside');
    alertFn.mockClear();

    await userEvent.click(canvas.getByRole('button', { name: 'inside' }));
    expect(alertFn).not.toHaveBeenCalled();

    alertFn.mockRestore();
  },
};

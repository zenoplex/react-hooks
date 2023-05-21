import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { UsePagination } from './UsePagination';

const meta = {
  component: UsePagination,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    currentPage: 1,
    totalPages: 5,
  },
} satisfies Meta<typeof UsePagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText(/\d/)).toHaveLength(5);
  },
};

export const Ellipsis: Story = {
  args: {
    currentPage: 12,
    totalPages: 30,
  },
};

export const ShowPreviousAndNext: Story = {
  args: {
    currentPage: 12,
    totalPages: 30,
    showPreviousAndNext: true,
  },
};

export const ShowFirstAndLast: Story = {
  args: {
    currentPage: 12,
    totalPages: 30,
    showFirstAndLast: true,
  },
};

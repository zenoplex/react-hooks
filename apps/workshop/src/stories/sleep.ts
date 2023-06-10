/**
 * Sleep for a given number of milliseconds.
 * Sometimes play function plays too fast that userEvent doesn't seem to work as intended.
 * https://github.com/storybookjs/storybook/issues/18258
 *
 * @param ms milliseconds to sleep
 * @returns Promise<void>
 */
export const sleep = (ms = 100): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

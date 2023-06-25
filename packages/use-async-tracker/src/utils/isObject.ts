/**
 * type guard for object
 *
 * @param value
 * @returns boolean
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

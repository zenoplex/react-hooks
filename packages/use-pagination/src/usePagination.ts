import React from 'react';
import { createPagination } from './createPagination';

type UsePagination = (
  arg: Parameters<typeof createPagination>[0]
) => ReturnType<typeof createPagination>;

export const usePagination: UsePagination = (params) => {
  const pagination = React.useMemo(() => {
    return createPagination(params);
  }, [params]);

  return pagination;
};

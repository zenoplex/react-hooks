import {
  EllipsisEntity,
  FirstEntity,
  LastEntity,
  NextEntity,
  PageEntity,
  PreviousEntity,
} from './types';

export const createPageEntity = (
  pageNum: number,
  currentPage: number
): PageEntity => ({
  type: 'page',
  value: pageNum,
  active: pageNum === currentPage,
});

export const createEllipsisEntity = (): EllipsisEntity => ({
  type: 'ellipsis',
  value: null,
  active: false,
});

export const createPreviousEntity = (currentPage: number): PreviousEntity => {
  const value = Math.max(1, currentPage - 1);
  return {
    type: 'previous',
    value: value,
    active: value === currentPage,
  };
};

export const createNextEntity = (
  currentPage: number,
  totalPages: number
): NextEntity => {
  const value = Math.min(totalPages, currentPage + 1);
  return {
    type: 'next',
    value: value,
    active: value === currentPage,
  };
};

export const createFirstEntity = (currentPage: number): FirstEntity => {
  return {
    type: 'first',
    value: 1,
    active: currentPage === 1,
  };
};

export const createLastEntity = (
  currentPage: number,
  totalPages: number
): LastEntity => {
  return {
    type: 'last',
    value: totalPages,
    active: totalPages === currentPage,
  };
};

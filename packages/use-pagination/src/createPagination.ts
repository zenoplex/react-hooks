import {
  createEllipsisEntity,
  createFirstEntity,
  createLastEntity,
  createNextEntity,
  createPageEntity,
  createPreviousEntity,
} from './createEntities';
import { Entity } from './types';
import { createRange } from './utils/createRange';

interface CreatePageItemArg {
  /** current page number */
  currentPage: number;
  /** total number of pages */
  totalPages: number;
  /** number of always visible pages before and after the current one */
  siblings?: number;
  /**  number of always visible pages at the beginning and end */
  boundaries?: number;
}

type CreatePageEntities = (arg: CreatePageItemArg) => Entity[];

const createPageEntities: CreatePageEntities = ({
  currentPage,
  totalPages,
  siblings = 1,
  boundaries = 1,
}) => {
  // No need for ellipsis if totalPages is less than page items
  const totalPageItems = siblings * 2 + 3 + boundaries * 2;
  if (totalPageItems >= totalPages) {
    return createRange(1, totalPages).map((page) =>
      createPageEntity(page, currentPage)
    );
  }

  const leftSiblingIndex = Math.max(currentPage - siblings, boundaries);
  const rightSiblingIndex = Math.min(
    currentPage + siblings,
    totalPages - boundaries
  );

  const showLeftEllipsis = leftSiblingIndex > boundaries + 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - (boundaries + 1);

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = siblings * 2 + boundaries + 2;
    return [
      ...createRange(1, leftItemCount).map((page) =>
        createPageEntity(page, currentPage)
      ),
      createEllipsisEntity(),
      ...createRange(totalPages - (boundaries - 1), totalPages).map((page) =>
        createPageEntity(page, currentPage)
      ),
    ];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = boundaries + 1 + 2 * siblings;
    return [
      ...createRange(1, boundaries).map((page) =>
        createPageEntity(page, currentPage)
      ),
      createEllipsisEntity(),
      ...createRange(totalPages - rightItemCount, totalPages).map((page) =>
        createPageEntity(page, currentPage)
      ),
    ];
  }

  return [
    ...createRange(1, boundaries).map((page) =>
      createPageEntity(page, currentPage)
    ),
    createEllipsisEntity(),
    ...createRange(leftSiblingIndex, rightSiblingIndex).map((page) =>
      createPageEntity(page, currentPage)
    ),
    createEllipsisEntity(),
    ...createRange(totalPages - boundaries + 1, totalPages).map((page) =>
      createPageEntity(page, currentPage)
    ),
  ];
};

type AddPreviousAndNextEntities = (
  entities: Entity[],
  currentPage: number,
  totalPages: number
) => Entity[];

const addPreviousAndNextEntities: AddPreviousAndNextEntities = (
  pageItems,
  currentPage,
  totalPages
): Entity[] => {
  const previousEntity = createPreviousEntity(currentPage);
  const nextEntity = createNextEntity(currentPage, totalPages);
  return [previousEntity, ...pageItems, nextEntity];
};

type AddFirstAndLastEntities = (
  entities: Entity[],
  currentPage: number,
  totalPages: number
) => Entity[];

const addFirstAndLastEntities: AddFirstAndLastEntities = (
  entities,
  currentPage,
  totalPages
) => {
  const firstEntity = createFirstEntity(currentPage);
  const lastEntity = createLastEntity(currentPage, totalPages);
  return [firstEntity, ...entities, lastEntity];
};

interface CreatePaginationArg extends CreatePageItemArg {
  /** boolean flag to hide previous and next page links */
  showFirstAndLast?: boolean;
  /** boolean flag to hide first and last page links */
  showPreviousAndNext?: boolean;
}
type CreatePagination = (arg: CreatePaginationArg) => Entity[];

export const createPagination: CreatePagination = ({
  currentPage,
  totalPages,
  siblings = 1,
  boundaries = 1,
  showPreviousAndNext,
  showFirstAndLast,
}) => {
  const pageItems = createPageEntities({
    currentPage,
    totalPages,
    siblings,
    boundaries,
  });

  const pageItems2 = showPreviousAndNext
    ? addPreviousAndNextEntities(pageItems, currentPage, totalPages)
    : pageItems;

  const pageItems3 = showFirstAndLast
    ? addFirstAndLastEntities(pageItems2, currentPage, totalPages)
    : pageItems2;

  return pageItems3;
};

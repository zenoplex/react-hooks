type Page = 'page';
type Ellipsis = 'ellipsis';
type Next = 'next';
type Previous = 'previous';
type First = 'first';
type Last = 'last';

export type Entity =
  | PageEntity
  | EllipsisEntity
  | NextEntity
  | PreviousEntity
  | FirstEntity
  | LastEntity;

export type PageEntity = {
  type: Page;
  value: number;
  active: boolean;
};

export type EllipsisEntity = {
  type: Ellipsis;
  value: null;
  active: false;
};

export type NextEntity = {
  type: Next;
  value: number;
  active: boolean;
};

export type PreviousEntity = {
  type: Previous;
  value: number;
  active: boolean;
};

export type FirstEntity = {
  type: First;
  value: number;
  active: boolean;
};

export type LastEntity = {
  type: Last;
  value: number;
  active: boolean;
};

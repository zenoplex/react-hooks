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
  id: string;
  type: Page;
  value: number;
  active: boolean;
};

export type EllipsisEntity = {
  id: 'left' | 'right';
  type: Ellipsis;
  value: null;
  active: false;
};

export type NextEntity = {
  id: 'next';
  type: Next;
  value: number;
  active: boolean;
};

export type PreviousEntity = {
  id: 'previous';
  type: Previous;
  value: number;
  active: boolean;
};

export type FirstEntity = {
  id: 'first';
  type: First;
  value: number;
  active: boolean;
};

export type LastEntity = {
  id: 'last';
  type: Last;
  value: number;
  active: boolean;
};

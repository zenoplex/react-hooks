import React from 'react';
import usePagination, { Entity } from '@gen/use-pagination';

type Props = Parameters<typeof usePagination>[0];

const Component: React.FC<Entity> = (props) => {
  switch (props.type) {
    case 'ellipsis':
      return (
        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
          ...
        </span>
      );
    case 'first':
      return (
        <a
          href={`https://example.com/search/${props.value}`}
          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span className="sr-only">Previous</span>
          &lt;&lt;
        </a>
      );

    case 'last':
      return (
        <a
          href={`https://example.com/search/${props.value}`}
          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span className="sr-only">Next</span>
          &gt;&gt;
        </a>
      );

    case 'previous':
      return (
        <a
          href={`https://example.com/search/${props.value}`}
          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span className="sr-only">Previous</span>
          &lt;
        </a>
      );

    case 'next':
      return (
        <a
          href={`https://example.com/search/${props.value}`}
          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span className="sr-only">Next</span>
          &gt;
        </a>
      );

    case 'page':
      return (
        <a
          href={`https://example.com/search/${props.value}`}
          aria-current="page"
          className={
            props.active
              ? 'relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
          }
        >
          {props.value}
        </a>
      );
    default:
      return null;
  }
};

export const UsePagination: React.FC<Props> = (props) => {
  const pagination = usePagination(props);

  return (
    <>
      <nav
        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        {pagination.map((page) => {
          return <Component key={page.id} {...page}></Component>;
        })}
      </nav>
    </>
  );
};

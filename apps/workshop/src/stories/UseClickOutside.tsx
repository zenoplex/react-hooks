import React from 'react';
import useClickOutside from '@gen/use-click-outside';

export const UseClickOutside: React.FC = () => {
  const [setRef] = useClickOutside({
    onClickOutside: () => window.alert('clicked outside'),
  });

  return (
    <div className="bg-slate-300 p-3 flex flex-col gap-3">
      <button>parent</button>
      <div ref={setRef} className="border bg-slate-100">
        <button>inside</button>
      </div>
      <div className="border bg-slate-100">
        <button>outside</button>
      </div>
    </div>
  );
};

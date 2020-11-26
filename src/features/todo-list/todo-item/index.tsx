import { memo } from 'react';

import type { DataProps } from '../../../types';

type ToDoItemProps = {
  deleteItem: (id: number) => void;
  toggleChecked: (id: number) => void;
} & DataProps;

export const TodoItem = memo(
  ({ id, title, completed, deleteItem, toggleChecked }: ToDoItemProps) => {
    const idString = id.toString();

    return (
      <li className="list__item">
        <div>
          <input
            className="list__checkbox"
            type="checkbox"
            id={idString}
            name={idString}
            value={title}
            checked={completed}
            onChange={() => toggleChecked(id)}
          />
          <label className="list__label" htmlFor={idString}>
            {title}
          </label>
        </div>
        <button className="button" type="button" onClick={() => deleteItem(id)}>
          delete
        </button>
      </li>
    );
  },
);

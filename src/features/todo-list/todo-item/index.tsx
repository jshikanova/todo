import { memo, useCallback, useState } from 'react';

import type { DataProps, SetTodosProps } from '../../../types';

type ToDoItemProps = {
  endpoint: string;
  todos: DataProps[];
} & DataProps &
  SetTodosProps;

export const TodoItem = memo(
  ({ id, title, completed, endpoint, todos, setTodos }: ToDoItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const idString = id.toString();

    const deleteItem = useCallback(() => {
      fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      });

      setTodos((todos) => todos.filter((item) => item.id !== id));
    }, [id, setTodos, endpoint]);

    const toggleChecked = useCallback(() => {
      fetch(`${endpoint}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          completed: !todos.find((item) => item.id === id)?.completed,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => {
          setTodos((todos) =>
            todos.map((item) => (item.id === id ? { ...json } : item)),
          );
        });

      setTodos((todos) =>
        todos.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item,
        ),
      );
    }, [id, todos, setTodos, endpoint]);

    const editItem = useCallback(
      (newTitle: string) => {
        setTodos((todos) =>
          todos.map((item) =>
            item.id === id ? { ...item, title: newTitle } : item,
          ),
        );
      },
      [id, setTodos],
    );

    const submitEdit = useCallback(() => {
      setIsEditing(false);

      fetch(`${endpoint}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: todos.find((item) => item.id === id)?.title,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }).then((response) => response.json());
    }, [id, endpoint, todos]);

    return (
      <li className="list__item">
        <div className="list__inputs-wrapper">
          <input
            className="list__checkbox"
            type="checkbox"
            id={idString}
            name={idString}
            value={title}
            checked={completed}
            onChange={toggleChecked}
          />
          {isEditing ? (
            <input
              className="list__input"
              defaultValue={title}
              onChange={(e) => editItem(e.target.value)}
            />
          ) : (
            <label className="list__label" htmlFor={idString}>
              {title}
            </label>
          )}
        </div>
        <div className="buttons-group">
          <button
            className="list__button"
            type="button"
            onClick={isEditing ? submitEdit : () => setIsEditing(true)}
          >
            {isEditing ? '💾' : '✏️'}
          </button>
          <button className="list__button" type="button" onClick={deleteItem}>
            ❌
          </button>
        </div>
      </li>
    );
  },
);

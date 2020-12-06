import { memo, useCallback, useRef, useEffect, useState } from 'react';

import type {
  DataProps,
  SetTodosProps,
  EditableItemIdProps,
} from '../../../types';

type ToDoItemProps = {
  endpoint: string;
  todos: DataProps[];
} & DataProps &
  SetTodosProps &
  EditableItemIdProps;

export const TodoItem = memo(
  ({
    id,
    title,
    completed,
    endpoint,
    todos,
    setTodos,
    editableItemId,
    setEditableItemId,
  }: ToDoItemProps) => {
    // TODO: Fix type
    const ref = useRef<any>();
    const [newTitle, setNewTltle] = useState(title);
    const isEditing = editableItemId === id;
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

    const submitEdit = useCallback(
      (id) => {
        if (title !== newTitle) {
          setTodos((todos) =>
            todos.map((item) =>
              item.id === id ? { ...item, title: newTitle } : item,
            ),
          );

          fetch(`${endpoint}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              title: todos.find((item) => item.id === id)?.title,
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          });
        }

        setEditableItemId(null);
      },
      [title, newTitle, setTodos, endpoint, todos, setEditableItemId],
    );

    useEffect(() => {
      const handleClickOutside = (e: Event) => {
        if (!ref.current || ref.current.contains(e.target)) return;

        submitEdit(id);
      };

      if (isEditing) document.addEventListener('mousedown', handleClickOutside);

      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [submitEdit, isEditing, id]);

    return (
      <li className="list__item" ref={ref}>
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
              onChange={(e) => setNewTltle(e.target.value)}
              onKeyDown={(e: any) => e.code === 'Enter' && submitEdit(id)}
              autoFocus
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
            onClick={
              isEditing ? () => submitEdit(id) : () => setEditableItemId(id)
            }
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

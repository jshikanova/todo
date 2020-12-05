import { memo, useCallback, useRef, useEffect } from 'react';

import type { DataProps, SetTodosProps } from '../../../types';

type ToDoItemProps = {
  endpoint: string;
  todos: DataProps[];
  editableItemId: number | null;
  setEditableItemId: React.Dispatch<React.SetStateAction<number | null>>;
} & DataProps &
  SetTodosProps;

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

    const submitEdit = useCallback(
      (id) => {
        fetch(`${endpoint}/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: todos.find((item) => item.id === id)?.title,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });

        setEditableItemId(null);
      },
      [setEditableItemId, endpoint, todos],
    );

    const handleEditableItemId = useCallback(
      (id) => {
        !!editableItemId && submitEdit(editableItemId);

        editableItemId !== id && setEditableItemId(id);
      },
      [editableItemId, setEditableItemId, submitEdit],
    );

    useEffect(() => {
      const handleClickOutside = (e: Event) => {
        if (!ref.current || ref.current.contains(e.target)) return;

        submitEdit(id);
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [submitEdit, id]);

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
              ref={ref}
              className="list__input"
              defaultValue={title}
              onChange={(e) => editItem(e.target.value)}
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
              isEditing ? () => submitEdit(id) : () => handleEditableItemId(id)
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

import { memo, useCallback } from 'react';

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

    // TODO: Fix double fetch on edit
    const submitEdit = useCallback(
      (id) => {
        setEditableItemId(null);

        fetch(`${endpoint}/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: todos.find((item) => item.id === id)?.title,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }).then((response) => response.json());
      },
      [setEditableItemId, endpoint, todos],
    );

    const handleEditableItemId = useCallback(
      (id) => {
        // TODO: Fix types
        setEditableItemId(
          (prevState: any): any => !!prevState && submitEdit(prevState),
        );

        setTimeout(() => setEditableItemId(id));
      },
      [setEditableItemId, submitEdit],
    );

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

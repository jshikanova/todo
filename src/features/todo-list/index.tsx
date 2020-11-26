import React, { useCallback, FC } from 'react';

import type { DataProps } from '../../types';
import { TodoItem } from './todo-item';

type TodoListProps = {
  todos: DataProps[];
  setTodos: React.Dispatch<React.SetStateAction<DataProps[]>>;
  endpoint: string;
};

export const TodoList: FC<TodoListProps> = ({ endpoint, todos, setTodos }) => {
  const deleteItem = useCallback(
    (id: number) => {
      fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      });

      setTodos((todos) => todos.filter((item) => item.id !== id));
    },
    [setTodos, endpoint],
  );

  const toggleChecked = useCallback(
    (id: number) => {
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
    },
    [todos, setTodos, endpoint],
  );

  return (
    <ul className="list">
      {todos.map((item) => (
        <TodoItem
          {...item}
          key={item.id}
          deleteItem={deleteItem}
          toggleChecked={toggleChecked}
        />
      ))}
    </ul>
  );
};

import React, { FC } from 'react';

import type { DataProps, SetTodosProps } from '../../types';
import { TodoItem } from './todo-item';
import './style.scss';

type TodoListProps = {
  todos: DataProps[];
  endpoint: string;
} & SetTodosProps;

export const TodoList: FC<TodoListProps> = ({ endpoint, todos, setTodos }) => {
  return (
    <ul className="list">
      {todos.map((item) => (
        <TodoItem
          {...item}
          key={item.id}
          endpoint={endpoint}
          todos={todos}
          setTodos={setTodos}
        />
      ))}
    </ul>
  );
};

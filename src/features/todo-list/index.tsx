import React, { FC } from 'react';

import type {
  DataProps,
  SetTodosProps,
  EditableItemIdProps,
} from '../../types';
import { TodoItem } from './todo-item';
import './style.scss';

type TodoListProps = {
  todos: DataProps[];
  endpoint: string;
} & SetTodosProps &
  EditableItemIdProps;

export const TodoList: FC<TodoListProps> = ({
  endpoint,
  todos,
  setTodos,
  editableItemId,
  setEditableItemId,
}) => {
  return (
    <ul className="list">
      {todos.map((item) => (
        <TodoItem
          {...item}
          key={item.id}
          endpoint={endpoint}
          todos={todos}
          setTodos={setTodos}
          editableItemId={editableItemId}
          setEditableItemId={setEditableItemId}
        />
      ))}
    </ul>
  );
};

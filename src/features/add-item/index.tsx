import React, { useState, useCallback, useEffect, memo, FC } from 'react';

import type { DataProps } from '../../types';

type AddItemProps = {
  todo: DataProps;
  setTodo: React.Dispatch<React.SetStateAction<DataProps>>;
  todos: DataProps[];
  setTodos: React.Dispatch<React.SetStateAction<DataProps[]>>;
  endpoint: string;
};

export const AddItem: FC<AddItemProps> = ({
  todo,
  setTodo,
  todos,
  setTodos,
  endpoint,
}) => {
  const addItem = useCallback(() => {
    fetch(`${endpoint}/${todo.id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((response) => response.json());
    // .then((json) => console.log(json));

    setTodos([...todos, todo]);
    setTodo({ ...todo, id: todo.id + 1, title: '', completed: false });
  }, [endpoint, todos, todo, setTodos, setTodo]);

  return (
    <>
      <h3>Add item:</h3>
      <div className="add-item">
        <input
          className="add-item__input"
          type="text"
          placeholder="Set new task here"
          value={todo.title}
          onChange={(e) => setTodo({ ...todo, title: e.target.value })}
          onKeyDown={(e: any) => e.code === 'Enter' && addItem()}
        />
        <button className="add-item__button" type="button" onClick={addItem}>
          Add
        </button>
      </div>
    </>
  );
};

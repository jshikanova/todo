import React, { useState, useCallback, useEffect, memo } from 'react';
import qs from 'qs';
import './App.css';

import type { DataProps } from './types';
import { useFetch } from './helpers';

const userId = 1;

const apiUrl = 'https://jsonplaceholder.typicode.com';
const todosEndpont = `${apiUrl}/todos`;

type ToDoItemProps = {
  deleteItem: (id: number) => void;
  toggleChecked: (id: number) => void;
} & DataProps;

// lala
const TodoItem = memo(
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
          <label htmlFor={idString}>{title}</label>
        </div>
        <button type="button" onClick={() => deleteItem(id)}>
          delete
        </button>
      </li>
    );
  },
);

const App = () => {
  const { loading, data } = useFetch(
    `${todosEndpont}/${qs.stringify({ userId }, { addQueryPrefix: true })}`,
  );

  const [todos, setTodos] = useState<DataProps[]>([]);
  const [todo, setTodo] = useState({
    userId: userId,
    id: 0,
    title: '',
    completed: false,
  });

  useEffect(() => setTodos(data), [data]);
  useEffect(
    () =>
      setTodo({
        userId: userId,
        id: todos[todos.length - 1]?.id + 1,
        title: '',
        completed: false,
      }),
    [todos],
  );

  const deleteItem = useCallback((id: number) => {
    fetch(`${todosEndpont}/${id}`, {
      method: 'DELETE',
    });

    setTodos((todos) => todos.filter((item) => item.id !== id));
  }, []);

  const addItem = useCallback(() => {
    fetch(`${todosEndpont}/${todo.id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((response) => response.json());
    // .then((json) => console.log(json));

    setTodos([...todos, todo]);
    setTodo({ ...todo, id: todo.id + 1, title: '', completed: false });
  }, [todos, todo]);

  const toggleChecked = useCallback(
    (id: number) => {
      fetch(`${todosEndpont}/${id}`, {
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
    [todos],
  );

  return (
    <div className="container">
      <h1>To Do List:</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <ul className="list">
          {todos.map((item) => (
            <TodoItem
              {...item}
              key={item.id}
              deleteItem={deleteItem}
              toggleChecked={toggleChecked}
            />
          ))}
          <h2>Add item:</h2>
          <div className="add-item">
            <input
              className="add-item__input"
              type="text"
              placeholder="Set new task here"
              value={todo.title}
              onChange={(e) => setTodo({ ...todo, title: e.target.value })}
              onKeyDown={(e: any) => e.code === 'Enter' && addItem()}
            />
            <button
              className="add-item__button"
              type="button"
              onClick={addItem}
            >
              Add
            </button>
          </div>
        </ul>
      )}
    </div>
  );
};

export default App;

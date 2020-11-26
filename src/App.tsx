import React, { useState, useEffect } from 'react';
import qs from 'qs';
import './App.css';

import type { DataProps } from './types';
import { useFetch } from './helpers';
import { AddItem, TodoList } from './features';

const userId = 1;

const apiUrl = 'https://jsonplaceholder.typicode.com';
const todosEndpont = `${apiUrl}/todos`;

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

  return (
    <div className="container">
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <h1>To Do List:</h1>
          <AddItem
            todo={todo}
            setTodo={setTodo}
            todos={todos}
            setTodos={setTodos}
            endpoint={todosEndpont}
          />
          <TodoList endpoint={todosEndpont} todos={todos} setTodos={setTodos} />
        </>
      )}
    </div>
  );
};

export default App;

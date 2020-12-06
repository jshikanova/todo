import React, { useState, useEffect, useMemo } from 'react';
import qs from 'qs';
import './style.scss';

import type { DataProps } from './types';
import { useFetch } from './helpers';
import { AddItem, TodoList, LoadingSpinner, SearchItem } from './features';

const userId = 1;

const apiUrl = 'https://jsonplaceholder.typicode.com';
const todosEndpont = `${apiUrl}/todos`;

const App = () => {
  const { loading, data } = useFetch(
    `${todosEndpont}/${qs.stringify({ userId }, { addQueryPrefix: true })}`,
  );

  const [initialTodos, setTodos] = useState<DataProps[]>([]);
  const [todo, setTodo] = useState({
    userId: userId,
    id: 0,
    title: '',
    completed: false,
  });
  const [search, setSearch] = useState<string>('');
  const todos = useMemo(
    () => initialTodos.filter(({ title }) => title.includes(search)),
    [initialTodos, search],
  );
  const [editableItemId, setEditableItemId] = useState<number | null>(null);

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
    <div className="page">
      <div className="container">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <h1 className="heading">To Do List:</h1>
            <AddItem
              todo={todo}
              setTodo={setTodo}
              todos={todos}
              setTodos={setTodos}
              endpoint={todosEndpont}
            />
            <SearchItem search={search} setSearch={setSearch} />
            <TodoList
              endpoint={todosEndpont}
              todos={todos}
              setTodos={setTodos}
              editableItemId={editableItemId}
              setEditableItemId={setEditableItemId}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;

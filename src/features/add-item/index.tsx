import { useCallback, FC } from 'react';

import type { DataProps, SetTodosProps, SetTodoProps } from '../../types';

type AddItemProps = {
  todo: DataProps;
  todos: DataProps[];
  endpoint: string;
} & SetTodosProps &
  SetTodoProps;

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
    <form className="form">
      <input
        className="form__input"
        type="text"
        placeholder="Set new task here"
        value={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
        onKeyDown={(e: any) => e.code === 'Enter' && addItem()}
      />
      <button className="button form__button" type="button" onClick={addItem}>
        Add
      </button>
    </form>
  );
};

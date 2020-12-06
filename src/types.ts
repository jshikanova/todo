export type DataProps = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export type SetTodosProps = {
  setTodos: React.Dispatch<React.SetStateAction<DataProps[]>>;
};

export type SetTodoProps = {
  setTodo: React.Dispatch<React.SetStateAction<DataProps>>;
};

export type EditableItemIdProps = {
  editableItemId: number | null;
  setEditableItemId: React.Dispatch<React.SetStateAction<number | null>>;
};

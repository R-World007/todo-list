import { useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../../../utils/todoValidation';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  const handleCancel = () => {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!isEditing || !isValidTodoTitle(workingTitle)) return;

    onUpdateTodo({ ...todo, title: workingTitle });
    setIsEditing(false);
  };

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`editTodo${todo.id}`}
              labelText="Todo"
              value={workingTitle}
              onChange={(event) => setWorkingTitle(event.target.value)}
            />
            <button type="button" onClick={handleCancel}>Cancel</button>
            <button type="submit" disabled={!isValidTodoTitle(workingTitle)}>
              Update
            </button>
          </>
        ) : (
          <>
            <input
              aria-label={`Mark ${todo.title} complete`}
              type="checkbox"
              id={`checkbox${todo.id}`}
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />
            <button type="button" className="todo-title" onClick={() => setIsEditing(true)}>
              {todo.title}
            </button>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;

import { useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList/TodoList';

const getResponseMessage = (data, fallback) => data?.message || fallback;
const getTask = (data) => data?.task || data;

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchTodos = async () => {
      setIsTodoListLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({ limit: '100' });
        const response = await fetch(`/api/tasks?${params}`, {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (response.status === 401) throw new Error('Unauthorized. Please log in again.');
        if (!response.ok) throw new Error('Unable to load todos.');

        const data = await response.json();
        setTodoList(data.tasks);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsTodoListLoading(false);
      }
    };

    fetchTodos();
  }, [token]);

  const addTodo = async (todoTitle) => {
    const temporaryTodo = {
      id: `temporary-${Date.now()}`,
      title: todoTitle,
      isCompleted: false,
    };

    setError('');
    setTodoList((previous) => [temporaryTodo, ...previous]);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(getResponseMessage(data, 'Unable to add todo.'));

      const savedTodo = getTask(data);
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === temporaryTodo.id ? savedTodo : todo)),
      );
    } catch (requestError) {
      setTodoList((previous) => previous.filter((todo) => todo.id !== temporaryTodo.id));
      setError(requestError.message);
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    setError('');
    setTodoList((previous) =>
      previous.map((todo) => (todo.id === id ? { ...todo, isCompleted: true } : todo)),
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ isCompleted: true }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(getResponseMessage(data, 'Unable to complete todo.'));
    } catch (requestError) {
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === id ? originalTodo : todo)),
      );
      setError(requestError.message);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    if (!originalTodo) return;

    setError('');
    setTodoList((previous) =>
      previous.map((todo) => (todo.id === editedTodo.id ? editedTodo : todo)),
    );

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(getResponseMessage(data, 'Unable to update todo.'));
    } catch (requestError) {
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === editedTodo.id ? originalTodo : todo)),
      );
      setError(requestError.message);
    }
  };

  return (
    <section aria-label="Todos">
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setError('')}>Clear Error</button>
        </div>
      )}
      {isTodoListLoading && <p role="status">Loading todos...</p>}
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </section>
  );
}

export default TodosPage;

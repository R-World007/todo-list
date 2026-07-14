import './App.css'
import TodoList from './TodoList';
import TodoForms from './TodoForm';

function App() {

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForms/>
      <TodoList/>
    </div>
  );
}

export default App
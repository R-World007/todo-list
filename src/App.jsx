import { useState } from 'react';
import './App.css';
import Logon from './features/Logon';
import TodosPage from './features/Todos/TodosPage';
import Header from './shared/Header';

function App() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  return (
    <main>
      <Header token={token} onSetToken={setToken} onSetEmail={setEmail} />
      {token ? (
        <TodosPage token={token} />
      ) : (
        <Logon onSetEmail={setEmail} onSetToken={setToken} />
      )}
      {token && email && <p className="signed-in-message">Signed in as {email}</p>}
    </main>
  );
}

export default App;

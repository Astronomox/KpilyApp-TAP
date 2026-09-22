import React, { useState } from 'react';
import './styles/App.css';

const App: React.FC = () => {
  const [page, setPage] = useState('dashboard');

  return (
    <div className="app">
      <nav>
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
        <button onClick={() => setPage('tasks')}>Tasks</button>
        <button onClick={() => setPage('blog')}>Blog</button>
      </nav>

      <main>
        {page === 'dashboard' && <div><h1>Dashboard</h1><p>KPI Tracking Dashboard</p></div>}
        {page === 'tasks' && <div><h1>Tasks</h1><p>Task list</p></div>}
        {page === 'blog' && <div><h1>Blog</h1><p>Blog posts</p></div>}
      </main>
    </div>
  );
};

export default App;

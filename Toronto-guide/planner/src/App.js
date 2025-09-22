import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Optimizer</h1>
        <p>Personal Life Management Application</p>
        <div className="admin-links">
          <a href="/admin-test.html" className="admin-link">
            🔧 Admin Panel
          </a>
          <a href="/simple-test.html" className="admin-link">
            🧪 Simple Test
          </a>
          <a href="/debug-test.html" className="admin-link">
            🐛 Debug Test
          </a>
        </div>
        <div className="status">
          <p>✅ Admin Module (Phase 1 & 2) - Production Ready</p>
          <p>🎯 Next: Personas Module Implementation</p>
        </div>
      </header>
    </div>
  );
}

export default App;

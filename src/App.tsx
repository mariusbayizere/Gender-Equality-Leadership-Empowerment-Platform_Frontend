import React from 'react';
import ExampleComponent from './components/ExampleComponent';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold">Gender Equality Leadership Empowerment Platform</h1>
      </header>
      <main>
        <ExampleComponent />
      </main>
    </div>
  );
};

export default App;
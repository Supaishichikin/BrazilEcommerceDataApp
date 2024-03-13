import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching message:', error));
  }, []);
  //new comment test

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello, World! bonjour monde</h1>
        <p>Message from the server: {message}</p>
      </header>
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:5000/api/auth/profile', { headers: { Authorization: token } })
        .then((res) => setUser(res.data))
        .catch((error) => console.error(error));
    } else {
      setUser(null);
    }
  }, [token]);

  const handleLogin = () => {
    axios
      .post('http://localhost:5000/api/auth/login', { email, password })
      .then((res) => {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      })
      .catch((error) => console.error(error));
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <div>
      {!token ? (
        <div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <p>{`Welcome, ${user?.name}`}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
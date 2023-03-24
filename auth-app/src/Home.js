import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/message')
      .then((res) => setMessage(res.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <p>{message}</p>
    </div>
  );
};

export default Home;
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    nav('/', { replace: true });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-xl font-semibold">Login</h1>
      <input type="email" required placeholder="Email"
        value={email} onChange={e=>setEmail(e.target.value)}
        className="w-full p-2 border rounded" />
      <input type="password" required placeholder="Password"
        value={password} onChange={e=>setPassword(e.target.value)}
        className="w-full p-2 border rounded" />
      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
        Sign In
      </button>
    </form>
  );
}

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { accessToken, user } = res.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('role', user.role);

      switch (user.role) {
        case 'Patient':
          navigate('/patient/dashboard', { replace: true });
          break;
        case 'Doctor':
          navigate('/doctor/calendar', { replace: true });
          break;
        case 'Receptionist':
          navigate('/reception/calendar', { replace: true });
          break;
        case 'Admin':
          navigate('/admin/users', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition-colors ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

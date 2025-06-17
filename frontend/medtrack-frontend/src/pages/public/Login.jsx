import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';                        // ← use our context
import { login as loginApi } from '../../api/auth';                   // ← API helper

export default function Login() {
  const { login } = useAuth();                                     // ← context login()
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const navigate               = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // call the shared API, context will store tokens + user
      const { user } = await login({ email, password });          
      
      // redirect based on role
      switch (user.role) {
        case 'Patient':
          navigate('/patient/dashboard', { replace: true });
          break;
        case 'Doctor':
          navigate('/doctor/calendar', { replace: true });
          break;
        case 'Receptionist':
          navigate('/receptionist/calendar', { replace: true });
          break;
        case 'Admin':
          navigate('/admin/users', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Login</h1>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />

        <input
          type="password"
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

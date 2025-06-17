import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../api/users';                         // ← API helper

export default function Register() {
  const [form, setForm] = useState({
    name: '', surname: '', parentName: '', email: '',
    phone: '', address: '', password: '',
    dateOfBirth: '', gender: 'M', role: 'Patient',
    personalNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createUser(form);                                      // ← call our API
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Register</h1>
        {error && <p className="text-red-600 text-center">{error}</p>}

        {[
          { name: 'name', placeholder: 'Name', required: true },
          { name: 'surname', placeholder: 'Surname', required: true },
          { name: 'parentName', placeholder: 'Parent Name' },
          { name: 'email', placeholder: 'Email', type: 'email', required: true },
          { name: 'phone', placeholder: 'Phone' },
          { name: 'address', placeholder: 'Address' },
          { name: 'password', placeholder: 'Password', type: 'password', required: true }
        ].map(field => (
          <input
            key={field.name}
            name={field.name}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            required={field.required}
            value={form[field.name]}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring"
          />
        ))}

        <div className="flex space-x-2">
          <label className="flex-1">
            Date of Birth
            <input
              type="date"
              name="dateOfBirth"
              required
              value={form.dateOfBirth}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </label>
          <label className="flex-1">
            Gender
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </label>
        </div>

        <input
          name="personalNumber"
          placeholder="Personal Number"
          value={form.personalNumber}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring"
        />

        {/* role is always Patient */}
        <input type="hidden" name="role" value="Patient" />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Registering…' : 'Register'}
        </button>
      </form>
    </div>
  );
}

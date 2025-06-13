import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    parentName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    dateOfBirth: '',
    gender: 'M',
    role: 'Patient',
    personalNumber: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/users', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold">Register</h1>
      {error && <p className="text-red-600">{error}</p>}

      <input name="name" value={form.name} onChange={handleChange}
        placeholder="Name" required className="w-full p-2 border rounded" />
      <input name="surname" value={form.surname} onChange={handleChange}
        placeholder="Surname" required className="w-full p-2 border rounded" />
      <input name="parentName" value={form.parentName} onChange={handleChange}
        placeholder="Parent Name" className="w-full p-2 border rounded" />
      <input type="email" name="email" value={form.email} onChange={handleChange}
        placeholder="Email" required className="w-full p-2 border rounded" />
      <input name="phone" value={form.phone} onChange={handleChange}
        placeholder="Phone" className="w-full p-2 border rounded" />
      <input name="address" value={form.address} onChange={handleChange}
        placeholder="Address" className="w-full p-2 border rounded" />
      <input type="password" name="password" value={form.password} onChange={handleChange}
        placeholder="Password" required className="w-full p-2 border rounded" />

      <div className="flex space-x-2">
        <label className="flex-1">
          Date of Birth
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange}
            required className="w-full p-2 border rounded mt-1" />
        </label>
        <label className="flex-1">
          Gender
          <select name="gender" value={form.gender} onChange={handleChange}
            className="w-full p-2 border rounded mt-1">
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </label>
      </div>

      <input name="personalNumber" value={form.personalNumber} onChange={handleChange}
        placeholder="Personal Number" className="w-full p-2 border rounded" />

      {/* Registration for patients only; role fixed */}
      <input type="hidden" name="role" value={form.role} />

      <button type="submit" className="w-full py-2 bg-green-600 text-white rounded">
        Register
      </button>
    </form>
  );
}

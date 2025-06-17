import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getPatientById, updatePatient } from '../../api/patients';

export default function MyProfile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    address: '',
    dateOfBirth: '',
    gender: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPatientById(user.userId)
      .then(data => {
        setForm({
          name: data.name,
          surname: data.surname,
          phone: data.phone,
          email: data.email,
          address: data.address,
          dateOfBirth: data.dateOfBirth.split('T')[0], // ISO to YYYY-MM-DD
          gender: data.gender.toLowerCase()
        });
      })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [user.userId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updatePatient(user.userId, {
        name: form.name,
        surname: form.surname,
        phone: form.phone,
        email: form.email,
        address: form.address,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender.charAt(0).toUpperCase() + form.gender.slice(1)
      });
      alert('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-6">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <h1 className="text-xl font-semibold">My Profile</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            name="surname"
            value={form.surname}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <input
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
      <button
        onClick={logout}
        className="w-full text-red-600 hover:underline text-center mt-4"
      >
        Log out
      </button>
    </div>
  );
}

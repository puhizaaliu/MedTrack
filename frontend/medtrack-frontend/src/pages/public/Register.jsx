import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPatient } from '../../api/patients';

export default function Register() {
  const [form, setForm] = useState({
    name: '', surname: '', parentName: '', email: '',
    phone: '', address: '', password: '',
    dateOfBirth: '', gender: 'M', role: 'Patient',
    personalNumber: '',
    medicalInfo: {
      allergies: '',
      medications: '',
      smoking: false,
      alcohol: false,
      physicalActivity: ''
    },
    familyHistory: [],
    chronicDiseases: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handles changes for normal fields
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handles changes for medicalInfo fields
  const handleMedicalInfoChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Prepare payload: role field is not required on backend, but doesn't hurt
      const payload = { ...form, role: undefined }; // Remove if not needed
      await createPatient(form);
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

        {/* --- Medical Info Section --- */}
        <h2 className="text-lg font-semibold mt-4">Medical Info</h2>
        <input
          name="allergies"
          placeholder="Allergies"
          value={form.medicalInfo.allergies}
          onChange={handleMedicalInfoChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="medications"
          placeholder="Medications"
          value={form.medicalInfo.medications}
          onChange={handleMedicalInfoChange}
          className="w-full p-2 border rounded"
        />
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="smoking"
              checked={form.medicalInfo.smoking}
              onChange={handleMedicalInfoChange}
              className="mr-2"
            />
            Smoking
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="alcohol"
              checked={form.medicalInfo.alcohol}
              onChange={handleMedicalInfoChange}
              className="mr-2"
            />
            Alcohol
          </label>
        </div>
        <input
          name="physicalActivity"
          placeholder="Physical Activity"
          value={form.medicalInfo.physicalActivity}
          onChange={handleMedicalInfoChange}
          className="w-full p-2 border rounded"
        />

        {/* role is always Patient, hidden for future-proofing */}
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

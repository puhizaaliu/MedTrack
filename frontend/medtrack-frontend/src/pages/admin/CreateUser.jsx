// src/pages/admin/CreateUser.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../../api/users'
import { createPatient } from '../../api/patients'
import { createDoctor } from '../../api/doctors'
import { listFamilyHistories } from '../../api/familyHistory'
import { listChronicDiseases } from '../../api/chronicDisease'
import { getSpecializations } from '../../api/specializations'

const ROLES = ['Patient', 'Doctor', 'Receptionist', 'Admin']
const GENDERS = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'O', label: 'Other' }
]

export default function CreateUser() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', surname: '', parentName: '', email: '', phone: '',
    address: '', dateOfBirth: '', gender: '', role: '', password: '', personalNumber: ''
  })
  const [medicalInfo, setMedicalInfo] = useState({
    allergies: '', medications: '', smoking: false,
    alcohol: false, physicalActivity: ''
  })
  const [familyHistory, setFamilyHistory] = useState([{ historyId: '', otherText: '' }])
  const [chronicDiseases, setChronicDiseases] = useState([{ diseaseId: '', otherText: '' }])
  const [doctorInfo, setDoctorInfo] = useState({ specializationId: '' })

  const [familyHistoryOptions, setFamilyHistoryOptions] = useState([])
  const [chronicDiseaseOptions, setChronicDiseaseOptions] = useState([])
  const [specializationOptions, setSpecializationOptions] = useState([])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    listFamilyHistories().then(setFamilyHistoryOptions).catch(console.error)
    listChronicDiseases().then(setChronicDiseaseOptions).catch(console.error)
    getSpecializations().then(setSpecializationOptions).catch(console.error)
  }, [])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleMedicalChange = e => {
    const { name, value, type, checked } = e.target
    setMedicalInfo(m => ({ ...m, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFamilyHistoryChange = (idx, e) => {
    const { name, value } = e.target
    setFamilyHistory(fh => {
      const copy = [...fh]
      copy[idx] = { ...copy[idx], [name]: value }
      return copy
    })
  }
  const addFamilyRow = () => {
    setFamilyHistory(fh => [...fh, { historyId: '', otherText: '' }])
  }

  const handleDiseaseChange = (idx, e) => {
    const { name, value } = e.target
    setChronicDiseases(cd => {
      const copy = [...cd]
      copy[idx] = { ...copy[idx], [name]: value }
      return copy
    })
  }

  const addDiseaseRow = () => {
    setChronicDiseases(cd => [...cd, { diseaseId: '', otherText: '' }])
  }

  const handleDoctorChange = e => {
    const { name, value } = e.target
    setDoctorInfo(d => ({ ...d, [name]: value === '' ? '' : Number(value) }))
  }

  // Main: single-step patient/doctor/user creation
  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (form.role === 'Patient') {
        const payload = {
          ...form,
          gender: form.gender,
          dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : undefined,
          medicalInfo,
          familyHistory: familyHistory.filter(h => h.historyId)
            .map(h => ({ historyId: Number(h.historyId), otherText: h.otherText || '' })),
          chronicDiseases: chronicDiseases.filter(d => d.diseaseId)
            .map(d => ({ diseaseId: Number(d.diseaseId), otherText: d.otherText || '' })),
        }
        await createPatient(payload)
      } else if (form.role === 'Doctor') {
        const payload = {
          ...form,
          gender: form.gender,
          dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : undefined,
          specializationId: Number(doctorInfo.specializationId),
        }
        console.log('Doctor payload', payload)
        await createDoctor(payload)
      } else {
        // Receptionist/Admin
        await createUser({
          ...form,
          gender: form.gender,
          dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : undefined,
        })
      }
      navigate('/admin/users')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" placeholder="First Name" onChange={handleChange} required />
          <input name="surname" placeholder="Surname" onChange={handleChange} required />
          <input name="parentName" placeholder="Parent's Name" onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="phone" placeholder="Phone" onChange={handleChange} />
          <input name="address" placeholder="Address" onChange={handleChange} />
          <input name="dateOfBirth" type="date" onChange={handleChange} />
          <select name="gender" onChange={handleChange}>
            <option value="">Select Gender</option>
            {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <select name="role" onChange={handleChange} required>
            <option value="">Select Role</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <input name="personalNumber" placeholder="Personal Number" onChange={handleChange} required />
        </div>

    {form.role === 'Patient' && (
        <div className="space-y-4">
            <h3 className="text-xl">Medical Info</h3>
            <input name="allergies" placeholder="Allergies" onChange={handleMedicalChange} className="border rounded px-5 py-2 mr-3" />
            <input name="medications" placeholder="Medications" onChange={handleMedicalChange} className="border rounded px-5 py-2" />
            <label className="mx-3"><input type="checkbox" name="smoking" onChange={handleMedicalChange} /> Smoking</label>
            <label className="mx-3"><input type="checkbox" name="alcohol" onChange={handleMedicalChange} /> Alcohol</label>
            <input name="physicalActivity" placeholder="Physical Activity" onChange={handleMedicalChange} className="border rounded px-5 py-2" />

            <h3 className="text-xl">Family History</h3>
            {familyHistory.map((fh, i) => (
            <div key={i} className="flex space-x-2">
                <select name="historyId" onChange={e => handleFamilyHistoryChange(i, e)}>
                <option key="select" value="">--Select--</option>
                {familyHistoryOptions.map(opt => (
                    <option key={opt.historyId} value={opt.historyId}>
                    {opt.conditionName}
                    </option>
                ))}
                </select>
                {/* <input name="otherText" placeholder="Other Details" onChange={e => handleFamilyHistoryChange(i, e)} /> */}
            </div>
            ))}
            <button type="button" onClick={addFamilyRow}>+ Add History</button>

            <h3 className="text-xl">Chronic Diseases</h3>
            {chronicDiseases.map((cd, i) => (
            <div key={i} className="flex space-x-2">
                <select name="diseaseId" onChange={e => handleDiseaseChange(i, e)}>
                <option key="select" value="">--Select--</option>
                {chronicDiseaseOptions.map(opt => (
                    <option key={opt.diseaseId} value={opt.diseaseId}>
                    {opt.diseaseName}
                    </option>
                ))}
                </select>
                {/* <input name="otherText" placeholder="Other Details" onChange={e => handleDiseaseChange(i, e)} /> */}
            </div>
            ))}
            <button type="button" onClick={addDiseaseRow}>+ Add Disease</button>
        </div>
    )}

    {form.role === 'Doctor' && (
    <div>
        <h3 className="text-xl">Doctor Details</h3>
        <select name="specializationId" value={doctorInfo.specializationId} onChange={handleDoctorChange} required>
        <option key="select" value="">--Select Specialization--</option>
        {specializationOptions.map(s => (
            <option key={String(s.specializationId ?? s.id)} 
            value={String(s.specializationId ?? s.id)}>{s.name}</option>
        ))}
        </select>
    </div>
    )}

        <div className="flex space-x-4">
        <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {submitting ? 'Creating...' : 'Create User'}
        </button>
        {error && <p className="text-red-600">{error}</p>}
        </div>

    </form>
    </div>
    )
}

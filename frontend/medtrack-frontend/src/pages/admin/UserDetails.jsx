import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getUserById, updateUser, deleteUser } from '../../api/users'
import { getPatientById, updatePatient } from '../../api/patients'
import { getDoctorById, updateDoctor } from '../../api/doctors'
import { getAllFamilyHistories } from '../../api/patientFamilyHistory'
import { getAllChronicDiseases } from '../../api/patientChronicDisease'
import { getSpecializations } from '../../api/specializations'

const GENDERS = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'O', label: 'Other' }
]

export default function UserDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()

  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: '', surname: '', parentName: '', email: '', phone: '',
    address: '', dateOfBirth: '', gender: '', role: ''
  })
  const [medicalInfo, setMedicalInfo] = useState({
    allergies: '', medications: '', smoking: false,
    alcohol: false, physicalActivity: ''
  })
  const [familyHistory, setFamilyHistory] = useState([])
  const [chronicDiseases, setChronicDiseases] = useState([])
  const [doctorInfo, setDoctorInfo] = useState({ specializationId: '', specializationName: '' })
  const [doctorSpecialization, setDoctorSpecialization] = useState({ specializationName: '' })

  const [familyHistoryOptions, setFamilyHistoryOptions] = useState([])
  const [chronicDiseaseOptions, setChronicDiseaseOptions] = useState([])
  const [specializationOptions, setSpecializationOptions] = useState([])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      getAllFamilyHistories(),
      getAllChronicDiseases(),
      getSpecializations(),
      getUserById(id)
    ])
    .then(([fhOpts, cdOpts, specOpts, user]) => {
      setFamilyHistoryOptions(fhOpts)
      setChronicDiseaseOptions(cdOpts)
      setSpecializationOptions(specOpts)
      const isoDOB = user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
        : ''
      setForm({
        name: user.name,
        surname: user.surname,
        parentName: user.parentName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dateOfBirth: isoDOB,
        gender: user.gender,
        role: user.role
      })
      if (user.role === 'Patient') {
        getPatientById(id).then(p => {
          const mi = p.medicalInfo || {}
          setMedicalInfo({
            allergies: mi.allergies || '',
            medications: mi.medications || '',
            smoking: mi.smoking || false,
            alcohol: mi.alcohol || false,
            physicalActivity: mi.physicalActivity || ''
          })
          setFamilyHistory(
            (p.familyHistory || []).map(fh => ({
              historyId: fh.historyId,
              otherText: fh.otherText || ''
            }))
          )
          setChronicDiseases(
            (p.chronicDiseases || []).map(cd => ({
              diseaseId: cd.disease?.diseaseId || cd.diseaseId,
              otherText: cd.otherText || '',
              diseaseName: cd.disease?.diseaseName || ''
            }))
          )
          setLoading(false)
        })
      } else if (user.role === 'Doctor') {
        getDoctorById(id).then(d => {
          setDoctorInfo({ specializationId: String(d.specializationId) || '' })
          setDoctorSpecialization({ specializationName: d.specializationName })
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })
    .catch(err => {
      console.error(err)
      setError('Failed to load data.')
    })
  }, [id])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }
  const handleMedicalChange = e => {
    const { name, value, type, checked } = e.target
    setMedicalInfo(m => ({ ...m, [name]: type === 'checkbox' ? checked : value }))
  }
  const handleFamilyChange = (idx, e) => {
    const { name, value } = e.target
    setFamilyHistory(fh => {
      const c = [...fh]
      c[idx] = { ...c[idx], [name]: value }
      return c
    })
  }
  const handleChronicChange = (idx, e) => {
    const { name, value } = e.target
    setChronicDiseases(cd => {
      const c = [...cd]
      c[idx] = { ...c[idx], [name]: value }
      return c
    })
  }
  const handleDoctorChange = e => {
    const { name, value } = e.target
    setDoctorInfo(d => ({ ...d, [name]: value }))
  }

  // Renamed to match button usage:
  const addFamilyHistoryRow = () => setFamilyHistory(fh => [...fh, { historyId: '', otherText: '' }])
  const removeFamilyHistory = idx => setFamilyHistory(fh => fh.filter((_, i) => i !== idx))
  const addChronicDiseaseRow = () => setChronicDiseases(cd => [...cd, { diseaseId: '', otherText: '' }])
  const removeChronicDisease = idx => setChronicDiseases(cd => cd.filter((_, i) => i !== idx))

  const handleEdit = () => setIsEditing(true)
  const handleCancel = () => setIsEditing(false)

  // UPDATED handleSubmit for new backend!
  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (form.role === 'Patient') {
        const payload = {
          ...form,
          dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : undefined,
          medicalInfo,
          familyHistory: familyHistory
            .filter(fh => fh.historyId && fh.historyId !== "")
            .map(fh => ({
              historyId: Number(fh.historyId),
              otherText: fh.otherText
            })),
          chronicDiseases: chronicDiseases
            .filter(cd => cd.diseaseId && cd.diseaseId !== "")
            .map(cd => ({
              diseaseId: Number(cd.diseaseId),
              otherText: cd.otherText
            })),
        }
        await updatePatient(id, payload)
      } else if (form.role === 'Doctor') {
          const payload = {
            ...form,
            specializationId: doctorInfo.specializationId
              ? Number(doctorInfo.specializationId)
              : undefined,
          }
          await updateDoctor(id, payload)
      } else {
        // Receptionist/Admin
        await updateUser(id, form)
      }
      setIsEditing(false)
    } catch (err) {
      setError('Save failed.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this user?')) return
    setSubmitting(true)
    try {
      await deleteUser(id)
      navigate('/admin/users')
    } catch {
      setError('Delete failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>Loading…</p>
  if (error) return <p className="text-red-600">{error}</p>
console.log('specializationOptions:', specializationOptions);

  return (
    <div className="p-6 bg-white rounded shadow">
      <button onClick={() => navigate(-1)} className="underline mb-4">← Back to Users</button>
      <h2 className="text-2xl mb-4">User Details</h2>

      {!isEditing ? (
        <div className="space-y-2">
          <p><strong>Name:</strong> {form.name} {form.surname}</p>
          <p><strong>Email:</strong> {form.email}</p>
          <p><strong>Role:</strong> {form.role}</p>
          {form.role === 'Patient' && (
            <>
              <p><strong>Allergies:</strong> {medicalInfo.allergies}</p>
              <p><strong>Medications:</strong> {medicalInfo.medications}</p>
              <p><strong>Smoking:</strong> {medicalInfo.smoking ? 'Yes' : 'No'}</p>
              <p><strong>Alcohol:</strong> {medicalInfo.alcohol ? 'Yes' : 'No'}</p>
              <p><strong>Physical Activity:</strong> {medicalInfo.physicalActivity}</p>
              <p><strong>Family History:</strong> {' '}
                {familyHistory.length > 0
                  ? familyHistory.map(fh => {
                    const name = familyHistoryOptions.find(opt => (opt.id || opt.historyId) === (fh.historyId))?.conditionName || ''
                    return name
                      ? `${name}${fh.otherText ? ` (${fh.otherText})` : ''}`
                      : fh.otherText
                  }).join(', ')
                  : 'None'}
              </p>
              <p><strong>Chronic Diseases:</strong> {' '}
                {chronicDiseases.length > 0
                  ? chronicDiseases
                    .map(cd => cd.diseaseName || cd.otherText)
                    .join(', ')
                  : 'None'}
              </p>
            </>
          )}
          {form.role === 'Doctor' && (
            <p><strong>Specialization:</strong>{' '}
              {doctorSpecialization.specializationName || 'None'}
            </p>
          )}
          <div className="flex space-x-4 mt-4">
            <button onClick={handleEdit} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
            <button onClick={handleDelete} disabled={submitting} className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50">Delete</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div className="grid grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} required />
            <input name="surname" value={form.surname} onChange={handleChange} required />
            <input name="parentName" value={form.parentName} onChange={handleChange} />
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
            <input name="phone" value={form.phone} onChange={handleChange} />
            <input name="address" value={form.address} onChange={handleChange} />
            <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option key="gender-0" value="">Select gender</option>
              {GENDERS.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          {/* Patient Extras */}
          {form.role === 'Patient' && (
            <div className="space-y-6">
              <h3 className="text-xl">Medical Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Allergies</label>
                  <input
                    name="allergies"
                    placeholder="e.g. Penicillin"
                    value={medicalInfo.allergies}
                    onChange={handleMedicalChange}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Medications</label>
                  <input
                    name="medications"
                    placeholder="e.g. Aspirin"
                    value={medicalInfo.medications}
                    onChange={handleMedicalChange}
                    className="mt-1 block w-full"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="smoking"
                    type="checkbox"
                    name="smoking"
                    checked={medicalInfo.smoking}
                    onChange={handleMedicalChange}
                    className="mr-2"
                  />
                  <label htmlFor="smoking">Smoking</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="alcohol"
                    type="checkbox"
                    name="alcohol"
                    checked={medicalInfo.alcohol}
                    onChange={handleMedicalChange}
                    className="mr-2"
                  />
                  <label htmlFor="alcohol">Alcohol</label>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Physical Activity</label>
                  <input
                    name="physicalActivity"
                    placeholder="e.g. 30 min/day"
                    value={medicalInfo.physicalActivity}
                    onChange={handleMedicalChange}
                    className="mt-1 block w-full"
                  />
                </div>
              </div>

              <h3 className="text-xl">Family History</h3>
              {familyHistory.length === 0 && <p className="text-gray-500">No entries</p>}
              {familyHistory.map((fh, i) => (
                <div key={fh.historyId || i} className="flex space-x-2 items-center">
                  <select
                    name="historyId"
                    value={fh.historyId}
                    onChange={e => handleFamilyChange(i, e)}
                    className="flex-1"
                    required
                  >
                    <option key="fh-0" value="">Select condition</option>
                    {familyHistoryOptions.map(opt => (
                      <option key={String(opt.id || opt.historyId)} value={String(opt.id || opt.historyId)}>
                        {opt.conditionName || opt.name}
                      </option>
                    ))}
                  </select>
                  <input
                    name="otherText"
                    placeholder="Details (optional)"
                    value={fh.otherText}
                    onChange={e => handleFamilyChange(i, e)}
                    className="flex-1"
                  />
                  <button type="button" onClick={() => removeFamilyHistory(i)} className="text-red-500" aria-label="Remove">&times;</button>
                </div>
              ))}
              {/* Fixed button handler: */}
              <button type="button" onClick={addFamilyHistoryRow} className="text-blue-600">+ Add</button>

              <h3 className="text-xl">Chronic Diseases</h3>
              {chronicDiseases.map((cd, i) => (
                <div key={cd.diseaseId || i} className="flex space-x-2 items-center">
                  <select
                    name="diseaseId"
                    value={cd.diseaseId}
                    onChange={e => handleChronicChange(i, e)}
                    className="flex-1"
                    required
                  >
                    <option key="cd-0" value="">Select disease</option>
                    {chronicDiseaseOptions.map(opt => (
                      <option
                        key={String(opt.id || opt.diseaseId)}
                        value={String(opt.id || opt.diseaseId)}
                      >
                        {opt.diseaseName || opt.name}
                      </option>
                    ))}
                  </select>
                  <input
                    name="otherText"
                    placeholder="Details (optional)"
                    value={cd.otherText}
                    onChange={e => handleChronicChange(i, e)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeChronicDisease(i)}
                    className="text-red-500"
                    aria-label="Remove"
                  >&times;</button>
                </div>
              ))}
              {/* Fixed button handler: */}
              <button type="button" onClick={addChronicDiseaseRow} className="text-blue-600">+ Add</button>
            </div>
          )}

          {form.role === 'Doctor' && (
            <div className="space-y-2">
              <h3 className="text-xl">Doctor Details</h3>
              <label className="block text-sm font-medium">Specialization</label>
              <select
                name="specializationId"
                value={doctorInfo.specializationId}
                onChange={handleDoctorChange}
                className="mt-1 block w-full"
                required
              >
              <option key="spec-0" value="">Select specialization</option>
                {specializationOptions
                  .filter(s => s && s.specializationId !== undefined && s.specializationId !== null)
                  .map(s => (
                    <option key={String(s.specializationId)} value={String(s.specializationId)}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >{submitting ? 'Saving…' : 'Save Changes'}</button>
            <button type="button" onClick={handleCancel} className="px-4 py-2 border rounded">Cancel</button>
            {error && <p className="text-red-600">{error}</p>}
          </div>
        </form>
      )}
    </div>
  )
}

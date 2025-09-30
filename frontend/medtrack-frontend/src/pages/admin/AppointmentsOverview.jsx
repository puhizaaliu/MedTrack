import React, { useState, useEffect, useMemo } from 'react'
import AppointmentList from '../../shared/AppointmentList'

import { getAllAppointments } from '../../api/appointments'
import { getAllDoctors }      from '../../api/doctors'
import { getAllPatients }     from '../../api/patients'

const STATUS_OPTIONS = [
  { value: '',           label: 'All statuses' },
  { value: 'Kerkese',     label: 'Pending'      },
  { value: 'Konfirmuar',  label: 'Confirmed'    },
  { value: 'NeProces',    label: 'In-Process'   },
  { value: 'Kryer',       label: 'Completed'    },
  { value: 'Paguar',      label: 'Paid'         },
  { value: 'NukKaArdhur', label: 'No-Show'      },
]

export default function AppointmentsOverview() {
  const [appointments, setAppointments] = useState([])
  const [doctors,      setDoctors]      = useState([])
  const [patients,     setPatients]     = useState([])

  const [statusFilter,  setStatusFilter]  = useState('')
  const [doctorFilter,  setDoctorFilter]  = useState('')  // always string
  const [patientFilter, setPatientFilter] = useState('')  // always string

  const [searchQuery, setSearchQuery] = useState('')
  
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    async function loadAll() {
      setLoading(true)
      try {
        const [appts, docs, pats] = await Promise.all([
          getAllAppointments(),
          getAllDoctors(),
          getAllPatients(),
        ])

        // 🔍 debug the shapes coming back
        console.log('APPTS:', appts)
        console.log('DOCTORS:', docs)
        console.log('PATIENTS:', pats)

        setAppointments(appts)
        setDoctors(docs)
        setPatients(pats)
      } catch {
        setError('Failed loading data')
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // filter once per-change, and treat IDs as strings for comparison
  const filtered = useMemo(() => {
    return appointments.filter(a => {
      if (statusFilter && a.status !== statusFilter)     return false
      if (doctorFilter && String(a.doctorId) !== doctorFilter)   return false
      if (patientFilter && String(a.patientId) !== patientFilter) return false
      
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const doctor = doctors.find(d => d.userId === a.doctorId)
        const patient = patients.find(p => p.userId === a.patientId)

        const doctorName = doctor ? `${doctor.name} ${doctor.surname}`.toLowerCase() : ''
        const patientName = patient ? `${patient.name} ${patient.surname}`.toLowerCase() : ''

        // Search across doctor, patient, status, and maybe date
        if (
          !doctorName.includes(q) &&
          !patientName.includes(q) &&
          !a.status.toLowerCase().includes(q) &&
          !(a.date && a.date.toLowerCase().includes(q))
        ) {
          return false
        }
      }

      return true
    })
  }, [appointments, statusFilter, doctorFilter, patientFilter, searchQuery, doctors, patients])

  const handleViewDetails = id => {
    console.log('view details for', id)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Appointments Overview</h1>
      {error && <p className="text-red-600">{error}</p>}

      <div className="bg-white p-4 rounded shadow space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border rounded p-2 w-full"
          >
            {STATUS_OPTIONS.map(opt => (
              <option
                key={opt.value || 'all-status'}      // ← unique key per status
                value={opt.value}
              >
                {opt.label}
              </option>
            ))}
          </select>

          {/* Doctor */}
          <select
            value={doctorFilter}
            onChange={e => setDoctorFilter(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option key="all-doctors" value="">
              All doctors
            </option>
            {doctors.map(doc => {
              // fallback to doc.id if your doctor objects don’t have `doctorId`
              const id = doc.userId  
              return (
                <option
                  key={`doctor-${id}`}               // ← unique key per doctor
                  value={`${id}`}   
                >
                  {doc.name} {doc.surname}
                </option>
              )
            })}
          </select>

          {/* Patient */}
          <select
            value={patientFilter}
            onChange={e => setPatientFilter(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option key="all-patients" value="">
              All patients
            </option>
            {patients.map(pt => {
              // fallback to pt.id if your patient objects don’t have `patientId`
              const id = pt.userId 
              return (
                <option
                  key={`patient-${id}`}               // ← unique key per patient
                  value={`${id}`} 
                >
                  {pt.name} {pt.surname}
                </option>
              )
            })}
          </select>
        </div>
        <input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="border rounded p-2 w-full"
          />

        {/* Table */}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <AppointmentList
            appointments={filtered}
            onViewDetails={handleViewDetails}
          />
        )}
      </div>
    </div>
  )
}

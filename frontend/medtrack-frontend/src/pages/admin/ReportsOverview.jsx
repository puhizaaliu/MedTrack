import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { getAllReports }      from '../../api/reports'
import { getAllAppointments } from '../../api/appointments'
import { getAllDoctors }      from '../../api/doctors'
import { getAllPatients }     from '../../api/patients'

import ReportList from '../../shared/ReportList'

export default function ReportsOverview() {
  const navigate = useNavigate()

  // raw data
  const [reports,      setReports]      = useState([])
  const [appointments, setAppointments] = useState([])
  const [doctors,      setDoctors]      = useState([])
  const [patients,     setPatients]     = useState([])

  // filters
  const [dateFilter,   setDateFilter]   = useState('')   // YYYY-MM-DD
  const [doctorFilter, setDoctorFilter] = useState('')   // userId as string
  const [patientFilter,setPatientFilter]= useState('')   // userId as string

  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    async function loadAll() {
      setLoading(true)
      try {
        const [reps, appts, docs, pats] = await Promise.all([
          getAllReports(),      // list of MedicalReportDTO :contentReference[oaicite:0]{index=0}
          getAllAppointments(), // list of AppointmentDTO    :contentReference[oaicite:1]{index=1}
          getAllDoctors(),      // list of doctors           :contentReference[oaicite:2]{index=2}
          getAllPatients(),     // list of patients          :contentReference[oaicite:3]{index=3}
        ])

        // quick debug to confirm shapes
        console.log({ reps, appts, docs, pats })

        setReports(reps)
        setAppointments(appts)
        setDoctors(docs)
        setPatients(pats)
      } catch (e) {
        setError('Failed loading data')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // 1) Merge each report with its appointment (to get doctorId & patientId)
  const enriched = useMemo(() => {
    return reports.map(r => {
      const appt = appointments.find(a => a.appointmentId === r.appointmentId) || {}
      return {
        ...r,
        doctorId:   appt.doctorId,
        doctorName: appt.doctorName,
        doctorSurname: appt.doctorSurname,
        patientId:    appt.patientId,
        patientName:  appt.patientName,
        patientSurname: appt.patientSurname,
      }
    })
  }, [reports, appointments])

  // 2) Apply filters
  const filtered = useMemo(() => {
    return enriched.filter(r => {
      // date filter: compare ISO date part (YYYY-MM-DD)
      if (dateFilter) {
        const repDate = new Date(r.createdAt).toISOString().slice(0,10)
        if (repDate !== dateFilter) return false
      }
      // doctor filter
      if (doctorFilter && String(r.doctorId) !== doctorFilter) return false
      // patient filter
      if (patientFilter && String(r.patientId) !== patientFilter) return false
      return true
    })
  }, [enriched, dateFilter, doctorFilter, patientFilter])

  if (loading) return <p className="text-center py-6">Loading all reports…</p>
  if (error)   return <p className="text-red-600 text-center py-6">{error}</p>

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold text-gray-800">All Medical Reports</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* – Report Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Report date
          </label>
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* – Doctor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Doctor
          </label>
          <select
            value={doctorFilter}
            onChange={e => setDoctorFilter(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option key="all-doctors" value="">
              All doctors
            </option>
            {doctors.map(doc => (
              <option
                key={`doc-${doc.userId}`}
                value={String(doc.userId)}
              >
                {doc.name} {doc.surname}
              </option>
            ))}
          </select>
        </div>

        {/* – Patient */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient
          </label>
          <select
            value={patientFilter}
            onChange={e => setPatientFilter(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option key="all-patients" value="">
              All patients
            </option>
            {patients.map(pt => (
              <option
                key={`pt-${pt.userId}`}
                value={String(pt.userId)}
              >
                {pt.name} {pt.surname}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <ReportList
        reports={filtered}
        onViewReport={id => navigate(`/admin/reports/${id}`)}
      /> 
    </div>
  )
}

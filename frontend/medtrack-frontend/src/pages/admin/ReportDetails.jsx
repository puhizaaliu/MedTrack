// src/pages/admin/ReportDetails.jsx

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getReportById } from '../../api/reports'
import ReportDetail from '../../shared/ReportDetail'

export default function AdminReportDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [detail, setDetail]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    // reset loading & error state whenever the ID changes
    setLoading(true)
    setError(null)

    getReportById(id)
      .then(data => {
        setDetail(data)
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message || 'Unknown error'
        setError(msg)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <p className="text-center py-6">Loading report...</p>
  }

  if (error) {
    return <p className="text-red-600 text-center py-6">{error}</p>
  }

  if (!detail) {
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
          &larr; Back to All Reports
        </button>
        <p className="text-center text-gray-600">No report data available.</p>
      </div>
    )
  }

  // Destructure the nested DTOs from the detail response
  const { report: reportDto, appointment, patient, doctor } = detail

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline"
      >
        &larr; Back to All Reports
      </button>

      <ReportDetail
        report={reportDto}
        appointment={appointment}
        patient={patient}
        doctor={doctor}
      />
    </div>
  )
}

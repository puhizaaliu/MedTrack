import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReportById } from '../../api/reports';
import ReportDetail from '../../shared/ReportDetail';

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  // store full detail DTO
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getReportById(id)
      .then(data => setDetail(data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)   return <p className="text-center py-6">Loading report...</p>;
  if (error)     return <p className="text-red-600 text-center py-6">{error}</p>;
  if (!detail)   return <p className="text-center py-6">No report found.</p>;

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline"
      >
        &larr; Back to Reports
      </button>
      <ReportDetail
        report={detail.report}
        appointment={detail.appointment}
        patient={detail.patient}
        doctor={detail.doctor}
      />
    </div>
  );
}

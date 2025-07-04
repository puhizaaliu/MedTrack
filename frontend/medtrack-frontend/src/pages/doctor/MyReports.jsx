// src/pages/doctor/MyReports.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAllReports } from '../../api/reports';
import ReportList from '../../shared/ReportList';

export default function MyReports() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Server will return only the reports this doctor authored
    getAllReports()
      .then(data => setReports(data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center py-6">Loading reports…</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center py-6">{error}</p>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800">My Issued Reports</h1>
      <ReportList
        reports={reports}
        onViewReport={id => navigate(`/doctor/reports/${id}`)}
      />
    </div>
  );
}

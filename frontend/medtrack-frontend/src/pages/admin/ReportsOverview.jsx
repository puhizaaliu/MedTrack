import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllReports } from '../../api/reports';
import ReportList from '../../shared/ReportList';

export default function ReportsOverview() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAllReports()
      .then(data => setReports(data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-6">Loading all reports...</p>;
  if (error) return <p className="text-red-600 text-center py-6">{error}</p>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold text-gray-800">All Medical Reports</h1>
      <ReportList
        reports={reports}
        onViewReport={id => navigate(`/admin/reports/${id}`)}
      />
    </div>
  );
}

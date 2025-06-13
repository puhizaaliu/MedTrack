import React from "react";
//si shembull se masanej e lidhi me databaze
const mockReports = [
  {
    id: "1",
    createdAt: "2025-06-01T10:30:00Z",
    symptoms: "Dhimbje koke",
    symptomDuration: "3 ditë",
    symptomEvolution: "Përkeqësim gradual",
    symptomFrequence: "Çdo mëngjes",
    symptomIntensity: 7,
    previousSimilarSymptom: true,
    diagnosis: "Migrenë",
    treatmentPlan: "Analgjetikë + pushim"
  },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Medical Reports</h1>
      {mockReports.length === 0 ? (
        <p className="text-gray-600">No medical reports available.</p>
      ) : (
        <div className="grid gap-6">
          {mockReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Report ID: {report.id}</span>
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
              <p><strong>Symptoms:</strong> {report.symptoms}</p>
              <p><strong>Duration:</strong> {report.symptomDuration}</p>
              <p><strong>Evolution:</strong> {report.symptomEvolution}</p>
              <p><strong>Frequency:</strong> {report.symptomFrequence}</p>
              <p><strong>Intensity:</strong> {report.symptomIntensity}/10</p>
              <p><strong>Previous Similar Symptoms:</strong> {report.previousSimilarSymptom ? "Yes" : "No"}</p>
              <p><strong>Diagnosis:</strong> {report.diagnosis}</p>
              <p><strong>Treatment Plan:</strong> {report.treatmentPlan}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

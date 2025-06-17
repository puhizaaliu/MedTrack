import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { createMedicalReport } from "../../api/reports";

export default function ReportForm() {
  const { id } = useParams(); // appointmentId
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    symptoms: "",
    symptomDuration: "",
    symptomEvolution: "",
    symptomFrequence: "",
    symptomIntensity: 1,
    previousSimilarSymptom: false,
    diagnosis: "",
    treatmentPlan: ""
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (type === "number" ? parseInt(value) : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createMedicalReport({
        appointmentId: parseInt(id),
        ...formData
      });
      navigate("/doctor/reports");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">New Medical Report</h2>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Symptoms</label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
            rows="3"
          />
        </div>

        {/* Symptom Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Symptom Duration</label>
          <input
            type="text"
            name="symptomDuration"
            value={formData.symptomDuration}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
          />
        </div>

        {/* Symptom Evolution */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Symptom Evolution</label>
          <select
            name="symptomEvolution"
            value={formData.symptomEvolution}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
          >
            <option value="">Select evolution</option>
            <option value="Perkeqesim">Përkeqësim</option>
            <option value="Njejte">Njëjtë</option>
            <option value="Permiresim">Përmirësim</option>
          </select>
        </div>

        {/* Symptom Frequence */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Symptom Frequency</label>
          <select
            name="symptomFrequence"
            value={formData.symptomFrequence}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
          >
            <option value="">Select frequency</option>
            <option value="Vazhdueshem">Vazhdueshem</option>
            <option value="Periodike">Periodike</option>
            <option value="RasteTeCaktuara">Raste të caktuara</option>
          </select>
        </div>

        {/* Symptom Intensity */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Symptom Intensity (1-10)</label>
          <input
            type="number"
            name="symptomIntensity"
            value={formData.symptomIntensity}
            onChange={handleChange}
            min="1"
            max="10"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
          />
        </div>

        {/* Previous Similar Symptom */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="previousSimilarSymptom"
            checked={formData.previousSimilarSymptom}
            onChange={handleChange}
            className="h-4 w-4 text-green-600 border-gray-300 rounded"
          />
          <label htmlFor="previousSimilarSymptom" className="ml-2 block text-sm text-gray-700">
            Had previous similar symptoms?
          </label>
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
            rows="3"
          />
        </div>

        {/* Treatment Plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Treatment Plan</label>
          <textarea
            name="treatmentPlan"
            value={formData.treatmentPlan}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400"
            rows="3"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded disabled:opacity-50 transition"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
}

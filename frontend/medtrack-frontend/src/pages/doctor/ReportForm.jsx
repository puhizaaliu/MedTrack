// src/pages/doctor/ReportForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAppointmentsByDoctor } from '../../api/appointments';
import { getPatientById, updatePatient } from '../../api/patients';
import { createMedicalReport } from '../../api/reports';

export default function ReportForm() {
  const { id: appointmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState(null);

  // Patient sub-forms
  const [medInfo, setMedInfo] = useState({
    allergies: '', medications: '', smoking: false,
    alcohol: false, physicalActivity: ''
  });
  const [familyHistory, setFamilyHistory]     = useState([]);
  const [chronicDiseases, setChronicDiseases] = useState([]);

  // New Medical Report form
  const [reportData, setReportData] = useState({
    symptoms: '', symptomDuration: '',
    symptomEvolution: '', symptomFrequence: '',
    symptomIntensity: 1, previousSimilarSymptom: false,
    diagnosis: '', treatmentPlan: ''
  });

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        // 1) Fetch all this doctor's appointments...
        const list = await getAppointmentsByDoctor(user.userId);
        // 2) ...then pick the one matching appointmentId
        const appt = list.find(a => a.appointmentId === +appointmentId);
        if (!appt) throw new Error('Appointment not found');
        setAppointment(appt);

        // 3) Load the patient (with nested MedicalInfo, FamilyHistory, ChronicDiseases)
        const pat = await getPatientById(appt.patientId);
        setPatient(pat);

        // 4) Prefill sub-forms
        if (pat.medicalInfo) {
          setMedInfo({
            allergies:       pat.medicalInfo.allergies,
            medications:     pat.medicalInfo.medications,
            smoking:         pat.medicalInfo.smoking,
            alcohol:         pat.medicalInfo.alcohol,
            physicalActivity:pat.medicalInfo.physicalActivity
          });
        }
        setFamilyHistory(pat.familyHistory);
        setChronicDiseases(pat.chronicDiseases);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [appointmentId, user.userId]);

  // Handlers for sub-forms
  const onMedChange = e => {
    const { name, type, checked, value } = e.target;
    setMedInfo(mi => ({
      ...mi,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onFamilyChange = (i, e) => {
    setFamilyHistory(fh => {
      const copy = [...fh];
      copy[i].conditionName = e.target.value;
      return copy;
    });
  };
  const addFamily    = () => setFamilyHistory(fh => [...fh, { historyId:0, conditionName:'' }]);
  const removeFamily = i => setFamilyHistory(fh => fh.filter((_, idx) => idx!==i));

  const onChronicChange = (i, e) => {
    setChronicDiseases(cd => {
      const copy = [...cd];
      copy[i].otherText = e.target.value;
      return copy;
    });
  };
  const addChronic    = () => setChronicDiseases(cd => [...cd, { diseaseId:0, otherText:'', disease:{ diseaseId:0, diseaseName:'' } }]);
  const removeChronic = i => setChronicDiseases(cd => cd.filter((_, idx) => idx!==i));

  // Handlers for report form
  const onReportChange = e => {
    const { name, type, checked, value } = e.target;
    setReportData(rd => ({
      ...rd,
      [name]: type==='checkbox' ? checked : (type==='number' ? +value : value)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // 1) Persist any patient edits
      await updatePatient(patient.userId, {
        ...patient,
        medicalInfo: medInfo,
        familyHistory,
        chronicDiseases
      });

      // 2) Create the new medical report
      await createMedicalReport({
        appointmentId: +appointmentId,
        ...reportData
      });

      navigate('/doctor/reports');
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center py-6">Loading…</p>;
  if (error)   return <p className="text-red-600 text-center py-6">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6 px-4">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
        &larr; Back
      </button>

      {/* Appointment Info */}
      <div className="bg-gray-50 p-4 rounded shadow">
        <h3 className="font-medium">Appointment #{appointment.appointmentId}</h3>
        <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {appointment.time}</p>
        <p><strong>Service:</strong> {appointment.serviceName}</p>
      </div>

      {/* Patient Info */}
      <div className="bg-gray-50 p-4 rounded shadow space-y-1">
        <h3 className="font-medium">Patient: {patient.name} {patient.surname}</h3>
        <p><strong>Phone:</strong> {patient.phone}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p><strong>DOB:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Medical Information */}
        <section className="space-y-2">
          <h4 className="text-lg font-semibold">Medical Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Allergies</label>
              <input name="allergies" value={medInfo.allergies}
                     onChange={onMedChange}
                     className="w-full border rounded p-2"/>
            </div>
            <div>
              <label>Medications</label>
              <input name="medications" value={medInfo.medications}
                     onChange={onMedChange}
                     className="w-full border rounded p-2"/>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="smoking"
                     checked={medInfo.smoking}
                     onChange={onMedChange}/>
              <label className="ml-2">Smoking</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="alcohol"
                     checked={medInfo.alcohol}
                     onChange={onMedChange}/>
              <label className="ml-2">Alcohol use</label>
            </div>
            <div className="col-span-2">
              <label>Physical Activity</label>
              <input name="physicalActivity" value={medInfo.physicalActivity}
                     onChange={onMedChange}
                     className="w-full border rounded p-2"/>
            </div>
          </div>
        </section>

        {/* Family History */}
        <section className="space-y-2">
          <h4 className="text-lg font-semibold">Family History</h4>
          {familyHistory.map((fh, i) => (
            <div key={i} className="flex items-center space-x-2">
              <input value={fh.conditionName}
                     onChange={e => onFamilyChange(i, e)}
                     className="flex-1 border rounded p-2"/>
              <button type="button"
                      onClick={() => removeFamily(i)}
                      className="text-red-600">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addFamily}
                  className="text-green-600 hover:underline">
            + Add Family History
          </button>
        </section>

        {/* Chronic Diseases */}
        <section className="space-y-2">
          <h4 className="text-lg font-semibold">Chronic Diseases</h4>
          {chronicDiseases.map((cd, i) => (
            <div key={i} className="flex items-center space-x-2">
              <span className="flex-1">{cd.disease.diseaseName}</span>
              <input placeholder="Notes"
                     value={cd.otherText}
                     onChange={e => onChronicChange(i, e)}
                     className="flex-1 border rounded p-2"/>
              <button type="button"
                      onClick={() => removeChronic(i)}
                      className="text-red-600">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addChronic}
                  className="text-green-600 hover:underline">
            + Add Chronic Disease
          </button>
        </section>

        {/* New Medical Report */}
        <section className="space-y-2">
          <h4 className="text-lg font-semibold">New Medical Report</h4>

          <div>
            <label>Symptoms</label>
            <textarea name="symptoms" value={reportData.symptoms}
                      onChange={onReportChange} required
                      className="w-full border rounded p-2" rows={3}/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Duration</label>
              <input name="symptomDuration"
                     value={reportData.symptomDuration}
                     onChange={onReportChange} required
                     className="w-full border rounded p-2"/>
            </div>
            <div>
              <label>Evolution</label>
              <select name="symptomEvolution"
                      value={reportData.symptomEvolution}
                      onChange={onReportChange} required
                      className="w-full border rounded p-2">
                <option value="">Select</option>
                <option value="Perkeqesim">Përkeqësim</option>
                <option value="Njejte">Njëjtë</option>
                <option value="Permiresim">Përmirësim</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label>Frequency</label>
              <select name="symptomFrequence"
                      value={reportData.symptomFrequence}
                      onChange={onReportChange} required
                      className="w-full border rounded p-2">
                <option value="">Select</option>
                <option value="Vazhdueshem">Vazhdueshem</option>
                <option value="Periodike">Periodike</option>
                <option value="RasteTeCaktuara">Raste të caktuara</option>
              </select>
            </div>
            <div>
              <label>Intensity (1–10)</label>
              <input type="number" name="symptomIntensity"
                     min={1} max={10}
                     value={reportData.symptomIntensity}
                     onChange={onReportChange} required
                     className="w-full border rounded p-2"/>
            </div>
            <div className="flex items-center mt-6">
              <input type="checkbox" name="previousSimilarSymptom"
                     checked={reportData.previousSimilarSymptom}
                     onChange={onReportChange}/>
              <label className="ml-2">Previous similar?</label>
            </div>
          </div>

          <div>
            <label>Diagnosis</label>
            <textarea name="diagnosis" value={reportData.diagnosis}
                      onChange={onReportChange} required
                      className="w-full border rounded p-2" rows={3}/>
          </div>

          <div>
            <label>Treatment Plan</label>
            <textarea name="treatmentPlan"
                      value={reportData.treatmentPlan}
                      onChange={onReportChange} required
                      className="w-full border rounded p-2" rows={3}/>
          </div>
        </section>

        <button type="submit" disabled={submitting}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50">
          {submitting ? 'Submitting…' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}

// src/pages/doctor/ReportForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAppointmentsByDoctor, updateAppointment } from '../../api/appointments';
import { getPatientById, updatePatient } from '../../api/patients';
import { createMedicalReport } from '../../api/reports';
import { listFamilyHistories } from "../../api/familyHistory";
import { listChronicDiseases } from "../../api/chronicDisease";
import { listPatientFamilyHistory, addPatientFamilyHistory, removePatientFamilyHistory } from "../../api/patientFamilyHistory";
import { listPatientChronicDiseases, addPatientChronicDisease, removePatientChronicDisease } from "../../api/patientChronicDisease";

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
  const [allFamilyHistories, setAllFamilyHistories] = useState([]);
  const [allChronicDiseases, setAllChronicDiseases] = useState([]);
  const [newFamilyId, setNewFamilyId] = useState("");
  const [newChronicId, setNewChronicId] = useState("");
  const [otherFamilyText, setOtherFamilyText] = useState("");
  const [otherChronicText, setOtherChronicText] = useState("");

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
        const list = await getAppointmentsByDoctor(user.userId);
        const appt = list.find(a => a.appointmentId === +appointmentId);
        if (!appt) throw new Error('Appointment not found');
        setAppointment(appt);

        const pat = await getPatientById(appt.patientId);
        setPatient(pat);

        if (pat.medicalInfo) {
          setMedInfo({
            allergies:       pat.medicalInfo.allergies,
            medications:     pat.medicalInfo.medications,
            smoking:         pat.medicalInfo.smoking,
            alcohol:         pat.medicalInfo.alcohol,
            physicalActivity:pat.medicalInfo.physicalActivity
          });
        }

        const pfh = await listPatientFamilyHistory(pat.userId);
        const pcd = await listPatientChronicDiseases(pat.userId);
        setFamilyHistory(pfh);
        setChronicDiseases(pcd);

        const fam = await listFamilyHistories();
        const chr = await listChronicDiseases();
        setAllFamilyHistories(fam);
        setAllChronicDiseases(chr);
        
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

  // Family history actions
  const addFamilyFromList = async () => {
    if (!newFamilyId) return;
    await addPatientFamilyHistory({ patientId: patient.userId, historyId: +newFamilyId });
    const added = allFamilyHistories.find(h => h.historyId === +newFamilyId);
    setFamilyHistory([...familyHistory, added]);
    setNewFamilyId("");
  };
  const addFamilyOther = async () => {
    if (!otherFamilyText) return;
    await addPatientFamilyHistory({ patientId: patient.userId, historyId: 0, otherText: otherFamilyText });
    setFamilyHistory([...familyHistory, { historyId: 0, otherText: otherFamilyText }]);
    setOtherFamilyText("");
  };
  const removeFamily = async (historyId) => {
    await removePatientFamilyHistory({ patientId: patient.userId, historyId });
    setFamilyHistory(familyHistory.filter(f => f.historyId !== historyId));
  };

  // Chronic disease actions
  const addChronicFromList = async () => {
    if (!newChronicId) return;
    await addPatientChronicDisease({ patientId: patient.userId, diseaseId: +newChronicId });
    const added = allChronicDiseases.find(d => d.diseaseId === +newChronicId);
    setChronicDiseases([...chronicDiseases, added]);
    setNewChronicId("");
  };
  const addChronicOther = async () => {
    if (!otherChronicText) return;
    await addPatientChronicDisease({ patientId: patient.userId, diseaseId: 0, otherText: otherChronicText });
    setChronicDiseases([...chronicDiseases, { diseaseId: 0, otherText: otherChronicText }]);
    setOtherChronicText("");
  };
  const removeChronic = async (diseaseId) => {
    await removePatientChronicDisease({ patientId: patient.userId, diseaseId });
    setChronicDiseases(chronicDiseases.filter(c => c.diseaseId !== diseaseId));
  };

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
      await updatePatient(patient.userId, {
        ...patient,
        medicalInfo: medInfo
      });

      await createMedicalReport({
        appointmentId: +appointmentId,
        ...reportData
      });

      await updateAppointment(+appointmentId, {
        status: "Kryer"
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
              <span className="flex-1">{fh.conditionName || fh.otherText}</span>
              <button type="button" onClick={() => removeFamily(fh.historyId)} className="text-red-600">Remove</button>
            </div>
          ))}
          <div className="flex space-x-2 mt-2">
            <select value={newFamilyId} onChange={(e) => setNewFamilyId(e.target.value)} className="flex-1 border rounded p-2">
              <option value="">Select condition…</option>
              {allFamilyHistories
                .filter(h => !familyHistory.some(f => f.historyId === h.historyId))
                .map(h => (
                  <option key={h.historyId} value={h.historyId}>{h.conditionName}</option>
                ))}
            </select>
            <button type="button" onClick={addFamilyFromList} className="bg-green-600 text-white px-3 rounded">Add</button>
          </div>
          {/* <div className="flex space-x-2 mt-2">
            <input type="text" placeholder="Other condition" value={otherFamilyText} onChange={(e) => setOtherFamilyText(e.target.value)} className="flex-1 border rounded p-2" />
            <button type="button" onClick={addFamilyOther} className="bg-green-600 text-white px-3 rounded">Add Other</button>
          </div> */}
        </section>

        {/* Chronic Diseases */}
        <section className="space-y-2">
          <h4 className="text-lg font-semibold">Chronic Diseases</h4>
          {chronicDiseases.map((cd, i) => (
            <div key={i} className="flex items-center space-x-2">
              <span className="flex-1">{cd.diseaseName || cd.disease?.diseaseName || cd.otherText}</span>
              <button type="button" onClick={() => removeChronic(cd.diseaseId)} className="text-red-600">Remove</button>
            </div>
          ))}
          <div className="flex space-x-2 mt-2">
            <select value={newChronicId} onChange={(e) => setNewChronicId(e.target.value)} className="flex-1 border rounded p-2">
              <option value="">Select disease…</option>
              {allChronicDiseases
                .filter(d => !chronicDiseases.some(c => c.diseaseId === d.diseaseId))
                .map(d => (
                  <option key={d.diseaseId} value={d.diseaseId}>{d.diseaseName}</option>
                ))}
            </select>
            <button type="button" onClick={addChronicFromList} className="bg-green-600 text-white px-3 rounded">Add</button>
          </div>
          {/* <div className="flex space-x-2 mt-2">
            <input type="text" placeholder="Other disease" value={otherChronicText} onChange={(e) => setOtherChronicText(e.target.value)} className="flex-1 border rounded p-2" />
            <button type="button" onClick={addChronicOther} className="bg-green-600 text-white px-3 rounded">Add Other</button>
          </div> */}
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

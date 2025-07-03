import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getPatientById, updatePatient } from '../../api/patients';
import { getAllChronicDiseases } from '../../api/patientChronicDisease';
import { getAllFamilyHistories } from '../../api/patientFamilyHistory';

export default function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Master data for select dropdowns
  const [chronicDiseaseOptions, setChronicDiseaseOptions] = useState([]);
  const [familyHistoryOptions, setFamilyHistoryOptions] = useState([]);

  useEffect(() => {
    if (!user?.userId) return;
    setLoading(true);

    Promise.all([
      getPatientById(user.userId),
      getAllChronicDiseases(),
      getAllFamilyHistories()
    ])
      .then(([data, chronicOpts, familyOpts]) => {
        setProfile(data);
        setChronicDiseaseOptions(chronicOpts);
        setFamilyHistoryOptions(familyOpts);

        setForm({
          name: data.name || "",
          surname: data.surname || "",
          parentName: data.parentName || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          dateOfBirth: data.dateOfBirth?.split('T')[0] || "",
          gender: data.gender || "",
          // personalNumber: data.personalNumber || "",
          medicalInfo: {
            allergies: data.medicalInfo?.allergies || "",
            medications: data.medicalInfo?.medications || "",
            smoking: data.medicalInfo?.smoking || false,
            alcohol: data.medicalInfo?.alcohol || false,
            physicalActivity: data.medicalInfo?.physicalActivity || "",
          },
          familyHistory: (data.familyHistories || []).map(fh => ({
            historyId: String(fh.historyId || fh.id || ""),
            otherText: fh.otherText || "",
          })),
          chronicDiseases: (data.chronicDiseases || []).map(cd => ({
            diseaseId: String(cd.disease?.diseaseId || cd.diseaseId || ""),
            otherText: cd.otherText || "",
          }))
        });
      })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [user?.userId]);
  console.log('PROFILE OBJECT:', profile);
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Medical info
  const handleMedicalChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  // Family History
  const handleFamilyChange = (i, e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const fh = [...prev.familyHistory];
      fh[i] = { ...fh[i], [name]: value };
      return { ...prev, familyHistory: fh };
    });
  };
  const addFamilyRow = () =>
    setForm(prev => ({
      ...prev,
      familyHistory: [...(prev.familyHistory || []), { historyId: "", otherText: "" }]
    }));
  const removeFamilyRow = idx =>
    setForm(prev => ({
      ...prev,
      familyHistory: prev.familyHistory.filter((_, i) => i !== idx)
    }));

  // Chronic Diseases
  const handleChronicChange = (i, e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const cd = [...prev.chronicDiseases];
      cd[i] = { ...cd[i], [name]: value };
      return { ...prev, chronicDiseases: cd };
    });
  };
  const addChronicRow = () =>
    setForm(prev => ({
      ...prev,
      chronicDiseases: [...(prev.chronicDiseases || []), { diseaseId: "", otherText: "" }]
    }));
  const removeChronicRow = idx =>
    setForm(prev => ({
      ...prev,
      chronicDiseases: prev.chronicDiseases.filter((_, i) => i !== idx)
    }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // Prepare data for DTO - make sure IDs are numbers (or undefined if empty)
      const payload = {
        ...form,
        medicalInfo: { ...form.medicalInfo },
        familyHistory: form.familyHistory.map(fh => ({
          historyId: fh.historyId ? Number(fh.historyId) : undefined,
          otherText: fh.otherText || "",
        })),
        chronicDiseases: form.chronicDiseases.map(cd => ({
          diseaseId: cd.diseaseId ? Number(cd.diseaseId) : undefined,
          otherText: cd.otherText || "",
        })),
      };
      await updatePatient(user.userId, payload);
      setEditMode(false);
      const updated = await getPatientById(user.userId);
      setProfile(updated);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <p className="text-center py-6">Loading user...</p>;
  if (loading) return <p className="text-center py-6">Loading profile...</p>;
  if (error) return <p className="text-center py-6 text-red-600">{error}</p>;
  if (!profile) return <p className="text-center py-6 text-gray-600">Profile not found.</p>;

  // Helper to map IDs to names for display
  const getDiseaseName = id =>
    chronicDiseaseOptions.find(opt => String(opt.id || opt.diseaseId) === String(id))?.diseaseName || "";
  const getConditionName = id =>
    familyHistoryOptions.find(opt => String(opt.id || opt.historyId) === String(id))?.conditionName || "";

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-xl font-semibold">My Profile</h1>
      <Section title="Personal Information">
        {editMode ? (
          <div className="space-y-3">
            <Input label="First Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Last Name" name="surname" value={form.surname} onChange={handleChange} />
            <Input label="Parent Name" name="parentName" value={form.parentName} onChange={handleChange} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Input label="Address" name="address" value={form.address} onChange={handleChange} />
            {/* <Input label="Personal Number" name="personalNumber" value={form.personalNumber} onChange={handleChange} /> */}
            <Input label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}
                className="w-full border rounded px-3 py-2">
                <option value="">Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>
        ) : (
          <>
            <InfoRow label="First Name" value={profile.name} />
            <InfoRow label="Last Name" value={profile.surname} />
            <InfoRow label="Parent Name" value={profile.parentName} />
            <InfoRow label="Phone" value={profile.phone} />
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Address" value={profile.address} />
            {/* <InfoRow label="Personal Number" value={profile.personalNumber} /> */}
            <InfoRow label="Date of Birth" value={profile.dateOfBirth?.split('T')[0]} />
            <InfoRow label="Gender" value={profile.gender} />
          </>
        )}
      </Section>

      <Section title="Medical Info">
        {editMode ? (
          <div className="space-y-3">
            <Input label="Allergies" name="allergies" value={form.medicalInfo.allergies} onChange={handleMedicalChange} />
            <Input label="Medications" name="medications" value={form.medicalInfo.medications} onChange={handleMedicalChange} />
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="checkbox" name="smoking" checked={form.medicalInfo.smoking} onChange={handleMedicalChange} /> <span className="ml-2">Smoking</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="alcohol" checked={form.medicalInfo.alcohol} onChange={handleMedicalChange} /> <span className="ml-2">Alcohol</span>
              </label>
            </div>
            <Input label="Physical Activity" name="physicalActivity" value={form.medicalInfo.physicalActivity} onChange={handleMedicalChange} />
          </div>
        ) : (
          <>
            <InfoRow label="Allergies" value={profile.medicalInfo?.allergies} />
            <InfoRow label="Medications" value={profile.medicalInfo?.medications} />
            <InfoRow label="Smoking" value={profile.medicalInfo?.smoking ? "Yes" : "No"} />
            <InfoRow label="Alcohol" value={profile.medicalInfo?.alcohol ? "Yes" : "No"} />
            <InfoRow label="Physical Activity" value={profile.medicalInfo?.physicalActivity} />
          </>
        )}
      </Section>

      <Section title="Chronic Diseases">
        {editMode ? (
          <div className="space-y-3">
            {form.chronicDiseases.length === 0 && (
              <span className="text-gray-600">None</span>
            )}
            {form.chronicDiseases.map((cd, i) => (
              <div key={i} className="flex gap-2 items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Disease</label>
                  <select
                    name="diseaseId"
                    value={cd.diseaseId}
                    onChange={e => handleChronicChange(i, e)}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select disease</option>
                    {chronicDiseaseOptions.map(opt => (
                      <option key={opt.id || opt.diseaseId} value={opt.id || opt.diseaseId}>
                        {opt.diseaseName || opt.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Other"
                  name="otherText"
                  value={cd.otherText}
                  onChange={e => handleChronicChange(i, e)}
                />
                <button type="button" onClick={() => removeChronicRow(i)} className="text-red-600 ml-1 font-bold text-lg">&times;</button>
              </div>
            ))}
            <button type="button" onClick={addChronicRow} className="text-blue-600">+ Add Disease</button>
          </div>
        ) : (
          <>
            {profile.chronicDiseases && profile.chronicDiseases.length > 0 ? (
              <ul className="list-disc ml-6">
                {profile.chronicDiseases.map((cd, i) => (
                  <li key={i}>
                   {cd.disease?.diseaseName || cd.diseaseName}
                    {cd.otherText ? ` (${cd.otherText})` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-600">None</span>
            )}
          </>
        )}
      </Section>

      <Section title="Family History">
        {editMode ? (
          <div className="space-y-3">
            {form.familyHistory.length === 0 && (
              <span className="text-gray-600">None</span>
            )}
            {form.familyHistory.map((fh, i) => (
              <div key={i} className="flex gap-2 items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Condition</label>
                  <select
                    name="historyId"
                    value={fh.historyId}
                    onChange={e => handleFamilyChange(i, e)}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select condition</option>
                    {familyHistoryOptions.map(opt => (
                      <option key={opt.id || opt.historyId} value={opt.id || opt.historyId}>
                        {opt.conditionName || opt.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Other"
                  name="otherText"
                  value={fh.otherText}
                  onChange={e => handleFamilyChange(i, e)}
                />
                <button type="button" onClick={() => removeFamilyRow(i)} className="text-red-600 ml-1 font-bold text-lg">&times;</button>
              </div>
            ))}
            <button type="button" onClick={addFamilyRow} className="text-blue-600">+ Add Condition</button>
          </div>
        ) : (
          <>
           {profile.familyHistory && profile.familyHistory.length > 0 ? (
            <ul className="list-disc ml-6">
              {profile.familyHistory.map((fh, i) => (
                <li key={i}>
                  {getConditionName(fh.historyId) || fh.conditionName}
                  {fh.otherText ? ` (${fh.otherText})` : ""}
                </li>
              ))}
            </ul>
            ) : (
              <span className="text-gray-600">None</span>
            )}
          </>
        )}
      </Section>

      <div className="flex gap-3 mt-6">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-semibold mb-1 text-gray-700">{title}</h2>
      <div className="bg-gray-50 rounded p-3">{children}</div>
    </div>
  );
}
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="text-gray-900">{value || "-"}</span>
    </div>
  );
}
function Input({ label, ...rest }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...rest}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}

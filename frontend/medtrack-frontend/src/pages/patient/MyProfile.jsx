import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getPatientById, updatePatient } from '../../api/patients';

export default function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.userId) return;
    setLoading(true);
    getPatientById(user.userId)
      .then(data => {
        setProfile(data);
        setForm({
          name: data.name || "",
          surname: data.surname || "",
          parentName: data.parentName || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          dateOfBirth: data.dateOfBirth?.split('T')[0] || "",
          gender: data.gender || ""
        });
      })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [user?.userId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      console.log('FORM PAYLOAD:', form); // <- Ky është hapi i rëndësishëm!
      await updatePatient(user.userId, form);
      setEditMode(false);
      // refresh data from API
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
            <InfoRow label="Date of Birth" value={profile.dateOfBirth?.split('T')[0]} />
            <InfoRow label="Gender" value={profile.gender} />
          </>
        )}
      </Section>

      <Section title="Medical Info">
        <InfoRow label="Allergies" value={profile.medicalInfo?.allergies} />
        <InfoRow label="Medications" value={profile.medicalInfo?.medications} />
        <InfoRow label="Smoking" value={profile.medicalInfo?.smoking ? "Yes" : "No"} />
        <InfoRow label="Alcohol" value={profile.medicalInfo?.alcohol ? "Yes" : "No"} />
        <InfoRow label="Physical Activity" value={profile.medicalInfo?.physicalActivity} />
      </Section>

      <Section title="Chronic Diseases">
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
      </Section>

      <Section title="Family History">
        {profile.familyHistories && profile.familyHistories.length > 0 ? (
          <ul className="list-disc ml-6">
            {profile.familyHistories.map((fh, i) => (
              <li key={i}>
                {fh.history?.conditionName || fh.conditionName}
                {fh.otherText ? ` (${fh.otherText})` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-600">None</span>
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

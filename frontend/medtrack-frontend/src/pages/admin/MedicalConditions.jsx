import React, { useEffect, useState } from "react";
import { listFamilyHistories, createFamilyHistory, updateFamilyHistory, deleteFamilyHistoryMaster, } from "../../api/familyHistory";
import { listChronicDiseases, createChronicDisease, updateChronicDiseaseMaster, deleteChronicDiseaseMaster, } from "../../api/chronicDisease";

export default function MedicalConditions() {
  const [activeTab, setActiveTab] = useState("family"); // "family" | "chronic"

  // Family History state
  const [family, setFamily] = useState([]);
  const [loadingFamily, setLoadingFamily] = useState(true);
  const [newCondition, setNewCondition] = useState("");
  const [editingFamilyId, setEditingFamilyId] = useState(null);
  const [editingConditionName, setEditingConditionName] = useState("");

  // Chronic Diseases state
  const [diseases, setDiseases] = useState([]);
  const [loadingDiseases, setLoadingDiseases] = useState(true);
  const [newDisease, setNewDisease] = useState("");
  const [editingDiseaseId, setEditingDiseaseId] = useState(null);
  const [editingDiseaseName, setEditingDiseaseName] = useState("");

  // Shared UI state
  const [error, setError] = useState("");
  const [filterFamily, setFilterFamily] = useState("");
  const [filterDisease, setFilterDisease] = useState("");

  // Load data on mount
  useEffect(() => {
    (async () => {
      try {
        const rows = await listFamilyHistories();
        setFamily(rows);
      } catch {
        setError("Failed loading family history conditions");
      } finally {
        setLoadingFamily(false);
      }
    })();

    (async () => {
      try {
        const rows = await listChronicDiseases();
        setDiseases(rows);
      } catch {
        setError("Failed loading chronic diseases");
      } finally {
        setLoadingDiseases(false);
      }
    })();
  }, []);

  // ------- Family History handlers -------
  const addFamilyHandler = async (e) => {
    e.preventDefault();
    if (!newCondition.trim()) return;
    try {
      await createFamilyHistory({ conditionName: newCondition.trim() });
      const rows = await listFamilyHistories();
      setFamily(rows);
      setNewCondition("");
    } catch {
      setError("Error creating family history item");
    }
  };

  const startEditFamily = (row) => {
    setEditingFamilyId(row.historyId);
    setEditingConditionName(row.conditionName);
  };

  const cancelEditFamily = () => {
    setEditingFamilyId(null);
    setEditingConditionName("");
  };

  const saveFamily = async (id) => {
    try {
      await updateFamilyHistory(id, { conditionName: editingConditionName });
      cancelEditFamily();
      const rows = await listFamilyHistories();
      setFamily(rows);
    } catch {
      setError("Error updating family history item");
    }
  };

  const deleteFamily = async (id) => {
    if (!window.confirm("Delete this condition?")) return;
    try {
      await deleteFamilyHistoryMaster(id);
      const rows = await listFamilyHistories();
      setFamily(rows);
    } catch {
      setError("Error deleting family history item");
    }
  };

  // ------- Chronic Disease handlers -------
  const addDiseaseHandler = async (e) => {
    e.preventDefault();
    if (!newDisease.trim()) return;
    try {
      await createChronicDisease({ diseaseName: newDisease.trim() });
      const rows = await listChronicDiseases();
      setDiseases(rows);
      setNewDisease("");
    } catch {
      setError("Error creating chronic disease");
    }
  };

  const startEditDisease = (row) => {
    setEditingDiseaseId(row.diseaseId);
    setEditingDiseaseName(row.diseaseName);
  };

  const cancelEditDisease = () => {
    setEditingDiseaseId(null);
    setEditingDiseaseName("");
  };

  const saveDisease = async (id) => {
    try {
      await updateChronicDiseaseMaster(id, { diseaseName: editingDiseaseName });
      cancelEditDisease();
      const rows = await listChronicDiseases();
      setDiseases(rows);
    } catch {
      setError("Error updating chronic disease");
    }
  };

  const deleteDisease = async (id) => {
    if (!window.confirm("Delete this disease?")) return;
    try {
      await deleteChronicDiseaseMaster(id);
      const rows = await listChronicDiseases();
      setDiseases(rows);
    } catch {
      setError("Error deleting chronic disease");
    }
  };

  // ------- Filters -------
  const filteredFamily = family.filter((f) =>
    f.conditionName.toLowerCase().includes(filterFamily.toLowerCase())
  );
  const filteredDiseases = diseases.filter((d) =>
    d.diseaseName.toLowerCase().includes(filterDisease.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Family History & Chronic Diseases</h1>
      {error && <p className="text-red-600">{error}</p>}

      {/* Tabs */}
      <div className="flex border-b mb-4 pb-1">
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === "family"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("family")}
        >
          Family History Illnesses
        </button>
        <button
          className={`ml-4 px-4 py-2 border-b-2 ${
            activeTab === "chronic"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("chronic")}
        >
          Chronic Diseases
        </button>
      </div>

      {activeTab === "family" ? (
        <div className="bg-white p-4 rounded shadow">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-3 mb-4 space-y-3 md:space-y-0">
            <form onSubmit={addFamilyHandler} className="flex-1 flex space-x-2">
              <input
                type="text"
                placeholder="New condition..."
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                required
                className="flex-1 border rounded p-2"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                Add
              </button>
            </form>
            <input
              type="text"
              placeholder="Filter..."
              value={filterFamily}
              onChange={(e) => setFilterFamily(e.target.value)}
              className="border rounded p-2 md:w-64"
            />
          </div>

          {loadingFamily ? (
            <p>Loading…</p>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Condition</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFamily.map((row, i) => (
                  <tr key={row.historyId} className="border-t">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">
                      {editingFamilyId === row.historyId ? (
                        <input
                          type="text"
                          value={editingConditionName}
                          onChange={(e) => setEditingConditionName(e.target.value)}
                          className="border rounded p-1 w-full"
                        />
                      ) : (
                        row.conditionName
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      {editingFamilyId === row.historyId ? (
                        <>
                          <button
                            onClick={() => saveFamily(row.historyId)}
                            className="text-green-600 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditFamily}
                            className="text-gray-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditFamily(row)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteFamily(row.historyId)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredFamily.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-gray-600">No items</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-3 mb-4 space-y-3 md:space-y-0">
            <form onSubmit={addDiseaseHandler} className="flex-1 flex space-x-2">
              <input
                type="text"
                placeholder="New disease..."
                value={newDisease}
                onChange={(e) => setNewDisease(e.target.value)}
                required
                className="flex-1 border rounded p-2"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                Add
              </button>
            </form>
            <input
              type="text"
              placeholder="Filter..."
              value={filterDisease}
              onChange={(e) => setFilterDisease(e.target.value)}
              className="border rounded p-2 md:w-64"
            />
          </div>

          {loadingDiseases ? (
            <p>Loading…</p>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Disease</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDiseases.map((row, i) => (
                  <tr key={row.diseaseId} className="border-t">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">
                      {editingDiseaseId === row.diseaseId ? (
                        <input
                          type="text"
                          value={editingDiseaseName}
                          onChange={(e) => setEditingDiseaseName(e.target.value)}
                          className="border rounded p-1 w-full"
                        />
                      ) : (
                        row.diseaseName
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      {editingDiseaseId === row.diseaseId ? (
                        <>
                          <button
                            onClick={() => saveDisease(row.diseaseId)}
                            className="text-green-600 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditDisease}
                            className="text-gray-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditDisease(row)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteDisease(row.diseaseId)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredDiseases.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-gray-600">No items</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

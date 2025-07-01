import React, { useState, useEffect } from 'react';
import {
  getSpecializations,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization
} from '../../api/specializations';
import {
  getAllServices,
  getSpecializationServices,
  createService,
  updateService,
  deleteService,
  addServiceToSpecialization,
  removeServiceFromSpecialization
} from '../../api/services';

export default function SpecializationsAndServices() {
  // Data states
  const [specializations, setSpecializations] = useState([]);
  const [services, setServices] = useState([]);
  const [svcSpecMap, setSvcSpecMap] = useState({}); // serviceId → specializationId

  const [loadingSpecs, setLoadingSpecs] = useState(true);
  const [loadingSvcs, setLoadingSvcs] = useState(true);
  const [error, setError] = useState('');

  // Create form states
  const [newSpecName, setNewSpecName] = useState('');
  const [newSvcName, setNewSvcName] = useState('');
  const [newSvcSpecId, setNewSvcSpecId] = useState('');

  // Inline edit states for specializations
  const [editingSpecId, setEditingSpecId] = useState(null);
  const [editingSpecName, setEditingSpecName] = useState('');

  // Inline edit states for services
  const [editingSvcId, setEditingSvcId] = useState(null);
  const [editingSvcName, setEditingSvcName] = useState('');
  const [editingSvcSpecId, setEditingSvcSpecId] = useState('');

  // — Load specializations & services on mount —
  useEffect(() => {
    (async () => {
      try {
        const specs = await getSpecializations();
        setSpecializations(specs);
      } catch {
        setError('Failed loading specializations');
      } finally {
        setLoadingSpecs(false);
      }
    })();

    (async () => {
      try {
        const svcs = await getAllServices();
        setServices(svcs);
      } catch {
        setError('Failed loading services');
      } finally {
        setLoadingSvcs(false);
      }
    })();
  }, []);

  // — Build service→specialization map once specs arrive —
  useEffect(() => {
    if (!loadingSpecs && specializations.length) {
      (async () => {
        const map = {};
        await Promise.all(
          specializations.map(async sp => {
            const rows = await getSpecializationServices(sp.specializationId);
            rows.forEach(r => {
              map[r.serviceId] = sp.specializationId;
            });
          })
        );
        setSvcSpecMap(map);
      })();
    }
  }, [loadingSpecs, specializations, services]);

  // — Specialization handlers —
  const createSpecHandler = async e => {
    e.preventDefault();
    try {
      await createSpecialization({ name: newSpecName });
      setNewSpecName('');
      const specs = await getSpecializations();
      setSpecializations(specs);
    } catch {
      setError('Error creating specialization');
    }
  };

  const startEditSpec = spec => {
    setEditingSpecId(spec.specializationId);
    setEditingSpecName(spec.name);
  };

  const cancelEditSpec = () => {
    setEditingSpecId(null);
    setEditingSpecName('');
  };

  const saveSpec = async id => {
    try {
      await updateSpecialization(id, { specializationId: id, name: editingSpecName });
      cancelEditSpec();
      const specs = await getSpecializations();
      setSpecializations(specs);
    } catch {
      setError('Error updating specialization');
    }
  };

  const deleteSpecHandler = async id => {
    if (!window.confirm('Delete this specialization?')) return;
    try {
      await deleteSpecialization(id);
      const specs = await getSpecializations();
      setSpecializations(specs);
    } catch {
      setError('Error deleting specialization');
    }
  };

  // — Service handlers —
  const createSvcHandler = async e => {
    e.preventDefault();
    try {
    await createService({ name: newSvcName });
    const fresh = await getAllServices();
    setServices(fresh);
    const created = fresh.find(s => s.name === newSvcName);
    if (created) {
      await addServiceToSpecialization(
        Number(newSvcSpecId),
        created.serviceId
      );
      setSvcSpecMap(m => ({ ...m, [created.serviceId]: Number(newSvcSpecId) }));
    }
    setNewSvcName('');
    setNewSvcSpecId('');
  } catch {
    setError('Error creating service');
  }
  };

  const startEditSvc = svc => {
    setEditingSvcId(svc.serviceId);
    setEditingSvcName(svc.name);
    // lookup existing spec from our map
    const specId = svcSpecMap[svc.serviceId] ?? '';
    setEditingSvcSpecId(specId.toString());
  };

  const cancelEditSvc = () => {
    setEditingSvcId(null);
    setEditingSvcName('');
    setEditingSvcSpecId('');
  };

  const saveSvc = async id => {
    try {
    await updateService(id, { serviceId: id, name: editingSvcName });
    const oldSpec = svcSpecMap[id];
    const newSpec = Number(editingSvcSpecId);
    if (oldSpec !== newSpec) {
      if (oldSpec) {
        await removeServiceFromSpecialization(oldSpec, id);
      }
      await addServiceToSpecialization(newSpec, id);
    }
     cancelEditSvc();
    const fresh = await getAllServices();
    setServices(fresh);
    setSvcSpecMap(m => ({ ...m, [id]: newSpec }));
  } catch {
    setError('Error updating service');
  }
  };

  const deleteSvcHandler = async id => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteService(id);
      setServices(await getAllServices());
    } catch {
      setError('Error deleting service');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Specializations & Services</h1>
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specializations Panel */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-medium mb-4">Specializations</h2>
          <form onSubmit={createSpecHandler} className="mb-4 flex space-x-2">
            <input
              type="text"
              placeholder="New specialization..."
              value={newSpecName}
              onChange={e => setNewSpecName(e.target.value)}
              required
              className="flex-1 border rounded p-2"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </form>

          {loadingSpecs ? (
            <p>Loading…</p>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {specializations.map((spec, i) => (
                  <tr key={spec.specializationId} className="border-t">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">
                      {editingSpecId === spec.specializationId ? (
                        <input
                          type="text"
                          value={editingSpecName}
                          onChange={e => setEditingSpecName(e.target.value)}
                          className="border rounded p-1 w-full"
                        />
                      ) : (
                        spec.name
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      {editingSpecId === spec.specializationId ? (
                        <>
                          <button
                            onClick={() => saveSpec(spec.specializationId)}
                            className="text-green-600 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditSpec}
                            className="text-gray-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditSpec(spec)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteSpecHandler(spec.specializationId)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {specializations.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-4 text-gray-600">
                      No specializations
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Services Panel */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-medium mb-4">Services</h2>
          <form onSubmit={createSvcHandler} className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="Service name..."
              value={newSvcName}
              onChange={e => setNewSvcName(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
            <select
              value={newSvcSpecId}
              onChange={e => setNewSvcSpecId(e.target.value)}
              required
              className="w-full border rounded p-2"
            >
              <option value="">Assign specialization</option>
              {specializations.map(sp => (
                <option key={sp.specializationId} value={sp.specializationId}>
                  {sp.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </form>

          {loadingSvcs ? (
            <p>Loading…</p>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Specialization</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc, i) => (
                  <tr key={svc.serviceId} className="border-t">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">
                      {editingSvcId === svc.serviceId ? (
                        <input
                          type="text"
                          value={editingSvcName}
                          onChange={e => setEditingSvcName(e.target.value)}
                          className="border rounded p-1 w-full"
                        />
                      ) : (
                        svc.name
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingSvcId === svc.serviceId ? (
                        <select
                          value={editingSvcSpecId}
                          onChange={e => setEditingSvcSpecId(e.target.value)}
                          className="border rounded p-1 w-full"
                        >
                          {specializations.map(sp => (
                            <option
                              key={sp.specializationId}
                              value={sp.specializationId}
                            >
                              {sp.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        specializations.find(
                          sp => sp.specializationId === svcSpecMap[svc.serviceId]
                        )?.name || '—'
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                      <div className="inline-flex items-center space-x-2">
                        {editingSvcId === svc.serviceId ? (
                        <>
                          <button
                            onClick={() => saveSvc(svc.serviceId)}
                            className="text-green-600 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditSvc}
                            className="text-gray-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditSvc(svc)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteSvcHandler(svc.serviceId)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      </div>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-4 text-gray-600">
                      No services
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

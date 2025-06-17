import React, { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import UserList from '../../shared/UserList';
import { getAllPatients } from '../../api/patients';
import { getAllDoctors } from '../../api/doctors';
import { getAllUsers } from '../../api/users';

export default function Users() {
  const navigate = useNavigate();
  const tabs = [
    {
      key: 'patients',
      label: 'Patients',
      fetchData: getAllPatients
    },
    {
      key: 'doctors',
      label: 'Doctors',
      fetchData: getAllDoctors
    },
    {
      key: 'receptionists',
      label: 'Receptionists',
      fetchData: () =>
        getAllUsers().then(list =>
          list.filter(u => u.role === 'Receptionist')
        )
    },
    {
      key: 'admins',
      label: 'Admins',
      fetchData: () =>
        getAllUsers().then(list =>
          list.filter(u => u.role === 'Admin')
        )
    }
  ];

  const [activeKey, setActiveKey] = useState('patients');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data whenever the active tab changes
  useEffect(() => {
    setLoading(true);
    const tab = tabs.find(t => t.key === activeKey);
    tab.fetchData()
      .then(data => {
        // Map DoctorDTO and PatientDTO into UserList shape
        const mapped = data.map(u => ({
          userId:  u.userId,
          name:    u.name,
          surname: u.surname,
          email:   u.email,
          role:    u.role.toString().toLowerCase()
        }));
        setUsers(mapped);
      })
      .finally(() => setLoading(false));
  }, [activeKey]);

  if (loading) return <p className="text-center py-6">Loading users…</p>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-3xl font-semibold">User Management</h1>
      <Tab.Group
        selectedIndex={tabs.findIndex(t => t.key === activeKey)}
        onChange={index => setActiveKey(tabs[index].key)}
      >
        <Tab.List className="flex space-x-4 border-b">
          {tabs.map(t => (
            <Tab
              key={t.key}
              className={({ selected }) =>
                selected
                  ? 'pb-2 border-b-2 border-green-500 text-green-600'
                  : 'pb-2 text-gray-600 hover:text-green-600'
              }
            >
              {t.label}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>

      <UserList
        users={users}
        onViewUser={id => navigate(`/admin/users/${id}`)}
      />
    </div>
);
}

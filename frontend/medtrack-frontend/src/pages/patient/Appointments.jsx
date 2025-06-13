import React, { useState } from "react";
import { Tab } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
//si shembuj se tani e lidhi me databaze
const appointmentData = {
  Kerkese: [
    { id: 1, service: "Cardiology", doctor: "Dr. Arber Mehmeti", date: "-", status: "Kerkese" },
  ],
  Konfirmuar: [
    { id: 2, service: "Dermatology", doctor: "Dr. Fjolla Berisha", date: "2025-06-20 10:00", status: "Konfirmuar" },
  ],
  NeProces: [],
  Kryer: [
    { id: 3, service: "Neurology", doctor: "Dr. Valon Krasniqi", date: "2025-05-30 13:00", status: "Kryer" },
  ],
  Paguar: [],
  NukKaArdhur: []
};

export default function Appointments() {
  const categories = Object.keys(appointmentData);

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
        <a
          href="/patient/appointments/new"
          className="bg-[#46F072] hover:bg-[#38c95f] text-white px-4 py-2 rounded-md font-medium"
        >
          Book Appointment
        </a>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-2 border-b">
          {categories.map((status) => (
            <Tab
              key={status}
              className={({ selected }) =>
                classNames(
                  "py-2 px-4 text-sm font-medium",
                  selected ? "border-b-2 border-[#46F072] text-[#46F072]" : "text-gray-600 hover:text-[#46F072]"
                )
              }
            >
              {status}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {categories.map((status) => (
            <Tab.Panel key={status} className="space-y-4">
              {appointmentData[status].length === 0 ? (
                <p className="text-gray-500">No appointments in this category.</p>
              ) : (
                <ul className="space-y-3">
                  {appointmentData[status].map((appt) => (
                    <li
                      key={appt.id}
                      className="bg-white shadow p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{appt.service}</h3>
                          <p className="text-sm text-gray-500">Doctor: {appt.doctor}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Date: {appt.date}</p>
                          <p className="text-sm font-semibold text-[#46F072]">{appt.status}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

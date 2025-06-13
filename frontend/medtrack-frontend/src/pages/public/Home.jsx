import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="bg-white rounded-xl shadow-md px-6 py-12 flex flex-col lg:flex-row items-center justify-between">
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl font-bold text-gray-800 leading-snug">
            Welcome to <span className="text-[#46F072]">MedTrack</span>
          </h1>
          <p className="text-gray-600">
            A modern platform for managing your medical appointments, health records,
            and patient history — all in one secure place.
          </p>
          <Link
            to="/register"
            className="inline-block bg-[#46F072] hover:bg-[#38c95f] text-white px-6 py-3 rounded-full font-medium transition"
          >
            Get Started
          </Link>
        </div>

        <div className="mt-10 lg:mt-0 lg:w-1/2">
          <img
            //src="/hospital-illustration.svg"
            alt="Hospital Illustration"
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">Book Appointments</h2>
          <p className="text-gray-500 mt-2">
            Schedule consultations with your preferred doctors in just a few clicks.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">Track Medical Reports</h2>
          <p className="text-gray-500 mt-2">
            Access and download your medical history anytime from anywhere.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">Easy Communication</h2>
          <p className="text-gray-500 mt-2">
            Stay connected with your doctor and clinic through integrated notifications.
          </p>
        </div>
      </section>
    </div>
  );
}

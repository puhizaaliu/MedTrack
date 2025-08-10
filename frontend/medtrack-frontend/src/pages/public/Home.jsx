import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserMd, FaStethoscope, FaCalendarCheck, FaHeartbeat, FaFileMedical, FaPhoneAlt, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { getSpecializations } from "../../api/specializations";
import { getSpecializationServices } from "../../api/services";
import { getAllDoctors } from "../../api/doctors";

export default function Home() {
  const [specializations, setSpecializations] = useState([]);
  const [loadingSpecs, setLoadingSpecs] = useState(true);
  const [errorSpecs, setErrorSpecs] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [errorDoctors, setErrorDoctors] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoadingSpecs(true);
    setErrorSpecs(null);

    getSpecializations()
      .then(async specs => {
        const withServices = await Promise.all(
          specs.map(async spec => {
            try {
              const services = await getSpecializationServices(spec.specializationId);
              return { ...spec, services: Array.isArray(services) ? services : [services] };
            } catch {
              return { ...spec, services: [] };
            }
          })
        );
        if (mounted) setSpecializations(withServices);
      })
      .catch(() => { if (mounted) setErrorSpecs("Could not load services"); })
      .finally(() => { if (mounted) setLoadingSpecs(false); });

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoadingDoctors(true);
    setErrorDoctors(null);

    getAllDoctors()
      .then(data => { if (mounted) setDoctors(data); })
      .catch(() => { if (mounted) setErrorDoctors("Could not load doctors"); })
      .finally(() => { if (mounted) setLoadingDoctors(false); });

    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="bg-white rounded-xl shadow-md px-6 py-12 flex flex-col lg:flex-row items-center justify-between">
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl font-bold text-gray-800 leading-snug">
            Welcome to <span className="text-[#46F072]">MedTrack Hospital</span>
          </h1>
          <p className="text-gray-600">
            Where your health and comfort come first. Manage appointments, view your medical records, and connect with our experienced doctors, all in one secure platform.
          </p>
          <Link
            to="/register"
            className="inline-block bg-[#46F072] hover:bg-[#38c95f] text-white px-6 py-3 rounded-full font-medium transition"
          >
            Get Started
          </Link>
        </div>
        <div className="mt-10 lg:mt-0 lg:w-1/2 flex justify-center">
          <img
            src="https://www.shutterstock.com/image-photo/confident-female-doctor-surgeon-stands-600nw-2521558407.jpg"
            alt="Hospital Illustration"
            className="w-[650px] h-[450px] object-cover rounded-xl shadow"
          />
        </div>
      </section>

      {/* About the Hospital */}
      <section className="bg-[#f7fdf9] rounded-xl shadow-md p-8 flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 flex justify-center">
          <img
            src="https://media.istockphoto.com/id/1350643534/photo/obtaining-a-patients-health-history.jpg?s=612x612&w=0&k=20&c=CzDOB36YFWQ5LSSwPj4AKbV_Wp2BtMdCJS_3WJ06M8E="
            alt="Team"
            className="w-[500px] h-[400px] object-cover rounded-lg shadow"
          />
        </div>
        <div className="flex-1 space-y-3">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">About MedTrack Hospital</h2>
          <p className="text-gray-700">
            MedTrack Hospital is a modern healthcare institution dedicated to providing the highest quality patient care, using the latest technology and compassionate, skilled professionals.
          </p>
          <p className="text-gray-600">
            Our mission is to ensure every patient receives personalized attention, timely diagnosis, and the best treatment available.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Static content, keys not required for static short lists */}
          <div className="bg-white rounded-lg shadow p-6 text-center flex flex-col items-center">
            <FaCalendarCheck className="text-3xl text-[#46F072] mb-2" />
            <h3 className="text-lg font-semibold text-gray-800">Book Appointments</h3>
            <p className="text-gray-500 mt-2">Fast, online scheduling with your preferred doctors.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center flex flex-col items-center">
            <FaFileMedical className="text-3xl text-[#46F072] mb-2" />
            <h3 className="text-lg font-semibold text-gray-800">Track Medical Reports</h3>
            <p className="text-gray-500 mt-2">Access your medical history and download reports anytime.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center flex flex-col items-center">
            <FaHeartbeat className="text-3xl text-[#46F072] mb-2" />
            <h3 className="text-lg font-semibold text-gray-800">Advanced Care</h3>
            <p className="text-gray-500 mt-2">Latest technology and treatments for your health needs.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center flex flex-col items-center">
            <FaStethoscope className="text-3xl text-[#46F072] mb-2" />
            <h3 className="text-lg font-semibold text-gray-800">Expert Doctors</h3>
            <p className="text-gray-500 mt-2">Our team is made up of experienced and compassionate professionals.</p>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Our Services</h2>
        {loadingSpecs ? (
          <div className="text-center">Loading services...</div>
        ) : errorSpecs ? (
          <div className="text-center text-red-500">{errorSpecs}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specializations.map(spec => (
              <div key={spec.specializationId || spec.name} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-[#46F072]">{spec.name}</h3>
                <ul className="text-gray-600 mt-2 list-disc list-inside">
                  {spec.services && spec.services.length > 0 ? (
                    spec.services.map((service, i) => (
                      <li key={service.serviceId || i}>{service.serviceName}</li>
                    ))
                  ) : (
                    <li key="no-service">No services listed</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Meet the Team */}
      <section>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Meet Our Doctors</h2>
        {loadingDoctors ? (
          <div className="text-center">Loading doctors...</div>
        ) : errorDoctors ? (
          <div className="text-center text-red-500">{errorDoctors}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctors.map((doctor, i) => (
              <div key={doctor.doctorId || i} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <FaUserMd className="text-4xl text-[#46F072] mb-3" />
                <h3 className="text-lg font-bold text-gray-700">
                  Dr. {doctor.name} {doctor.surname}
                </h3>
                <p className="text-gray-500">{doctor.specializationName}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How it Works */}
      <section>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Static content, no key needed */}
          <div className="bg-[#f8fafc] rounded-lg p-4 flex flex-col items-center">
            <FaCalendarCheck className="text-2xl text-[#46F072]" />
            <p className="mt-2 text-gray-700 font-medium">Book an Appointment</p>
          </div>
          <div className="bg-[#f8fafc] rounded-lg p-4 flex flex-col items-center">
            <FaStethoscope className="text-2xl text-[#46F072]" />
            <p className="mt-2 text-gray-700 font-medium">Visit the Clinic</p>
          </div>
          <div className="bg-[#f8fafc] rounded-lg p-4 flex flex-col items-center">
            <FaFileMedical className="text-2xl text-[#46F072]" />
            <p className="mt-2 text-gray-700 font-medium">Get Your Medical Report</p>
          </div>
          <div className="bg-[#f8fafc] rounded-lg p-4 flex flex-col items-center">
            <FaHeartbeat className="text-2xl text-[#46F072]" />
            <p className="mt-2 text-gray-700 font-medium">Stay Healthy!</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto grid gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-700">How do I book an appointment?</h3>
            <p className="text-gray-600 mt-1">Simply register or log in, and use our appointment booking tool to select a doctor and time slot that works for you.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-700">Can I access my medical records?</h3>
            <p className="text-gray-600 mt-1">Yes, all your reports and history are securely available to you after login.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-700">Is my data secure?</h3>
            <p className="text-gray-600 mt-1">Absolutely! We use industry-standard encryption and privacy controls to protect your information.</p>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="mt-12 py-8 border-t bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="font-bold text-[#46F072] text-xl">MedTrack Hospital</span>
            <p className="text-gray-500 text-sm mt-2">Rruga e Spitalit, Prishtina<br />Phone: <a href="tel:+38344123456" className="underline">+383 44 123 456</a><br />Email: <a href="mailto:info@medtrack.com" className="underline">info@medtrack.com</a></p>
          </div>
          <div className="flex gap-4 text-[#46F072] text-2xl">
            <a href="#" title="Facebook" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" title="Twitter" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" title="Instagram" aria-label="Instagram"><FaInstagram /></a>
          </div>
          <div className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} MedTrack. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

// receptionist/Payments.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAppointmentById, updateAppointment } from "../../api/appointments";
import { createInvoice, getAllInvoices } from "../../api/invoices";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeForm from "../../shared/StripeForm";
import InvoiceView from "../../shared/InvoiceView"; 

const PAYMENT_METHODS = [
  { value: "Cash", label: "Cash" },
  { value: "Card", label: "Credit Card" },
  { value: "Online", label: "Online (Stripe)" },
];

const stripePromise = loadStripe("pk_test_51ObRxTCSYuG83n8W5dInfOMmll1ZCxLz2SidGO2l1iR7s9Qazn1QkAFvAw2LeoalPVEDZTzKf8JXUN2jh2ADDqIk007bDVwTJo");

export default function Payments() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointment");
  const [appointment, setAppointment] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [form, setForm] = useState({ amount: "", method: "" });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!appointmentId) return;
    setLoading(true);

    getAppointmentById(appointmentId)
      .then((appt) => {
        setAppointment(appt);
        return getAllInvoices();
      })
      .then((invoices) => {
        const inv = invoices.find(
          (i) => String(i.appointmentId) === String(appointmentId)
        );
        if (inv) setInvoice(inv);
      })
      .catch((err) => setError("Failed to load data."))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);

    if (!form.amount || !form.method) {
      setError("Please fill in the amount and select a payment method.");
      setCreating(false);
      return;
    }

    if (form.method === "Online" && !paymentSucceeded) {
      setError("Please complete the online payment first.");
      setCreating(false);
      return;
    }

    try {
      const newInvoice = await createInvoice({
        AppointmentId: Number(appointmentId),
        Amount: Number(form.amount),
        Method: form.method,
        PaymentStatus: true,
      });

      setInvoice(newInvoice);
      await updateAppointment(appointmentId, { status: "Paguar" });
      const updatedAppointment = await getAppointmentById(appointmentId);
      setAppointment(updatedAppointment);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to process payment. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (!appointment)
    return (
      <div className="py-10 text-center text-red-700">No appointment found.</div>
    );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Payment for Appointment</h1>

      <section className="bg-gray-50 p-4 mb-6 rounded shadow">
        <div>
          <b>Patient:</b> {appointment.patientName} {appointment.patientSurname}
        </div>
        <div>
          <b>Doctor:</b> {appointment.doctorName} {appointment.doctorSurname}
        </div>
        <div>
          <b>Service:</b> {appointment.serviceName}
        </div>
        <div>
          <b>Date:</b>{" "}
          {appointment.date && appointment.date !== "0001-01-01"
            ? new Date(appointment.date).toLocaleDateString()
            : "-"}
        </div>
      </section>

      {invoice ? (
        <InvoiceView invoice={invoice} appointment={appointment} />
      ) : (
        <>
          {/* Form for amount + method */}
          <form
            className="bg-white p-6 rounded shadow space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block mb-1 font-medium">Amount (€)</label>
              <input
                type="number"
                name="amount"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleInput}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Payment Method</label>
              <select
                name="method"
                value={form.method}
                onChange={handleInput}
                className="border rounded px-3 py-1"
                required
              >
                <option value="">Select...</option>
                {PAYMENT_METHODS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="text-red-600 font-medium">{error}</div>}

            {/* Buttons */}
            <div className="flex space-x-4 mt-4">
              <button
                type="submit"
                disabled={
                  creating || (form.method === "Online" && !paymentSucceeded)
                }
                className={`px-4 py-2 rounded text-white ${
                  creating || (form.method === "Online" && !paymentSucceeded)
                    ? "bg-gray-400"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {creating ? "Processing..." : "Done"}
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Stripe form rendered outside the main form to avoid nesting */}
          {form.method === "Online" &&
            form.amount &&
            !isNaN(parseFloat(form.amount)) && (
              <div className="mt-6">
                <Elements stripe={stripePromise}>
                  <StripeForm
                    amount={parseFloat(form.amount)}
                    appointmentId={appointmentId}
                    onSuccess={() => setPaymentSucceeded(true)}
                  />
                </Elements>
              </div>
          )}
        </>
      )}
    </div>
  );
}

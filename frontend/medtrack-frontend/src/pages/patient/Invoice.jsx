// patient/Invoice.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAppointmentById } from "../../api/appointments";
import { getInvoicesByPatient } from "../../api/invoices";
import InvoiceView from "../../shared/InvoiceView";
import { useAuth } from "../../hooks/useAuth";

export default function PatientInvoicePage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointment");

  const [invoice, setInvoice] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!appointmentId || !user?.userId) return;

    setLoading(true);
    setError(null);

    getAppointmentById(appointmentId)
      .then((appt) => {
        setAppointment(appt);
        return getInvoicesByPatient(user.userId);
      })
      .then((invoices) => {
        const inv = invoices.find(
          (i) => String(i.appointmentId) === String(appointmentId)
        );
        if (inv) setInvoice(inv);
        else setError("Invoice not found.");
      })
      .catch(() => setError("Failed to load invoice."))
      .finally(() => setLoading(false));
  }, [appointmentId, user?.userId]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!invoice || !appointment) return null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Invoice</h1>
      <InvoiceView invoice={invoice} appointment={appointment} />
    </div>
  );
}

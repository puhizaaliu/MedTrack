// receptionist/Payments.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAppointmentById, updateAppointment } from "../../api/appointments";
import { createInvoice, getAllInvoices } from "../../api/invoices";

const PAYMENT_METHODS = [
  { value: "Cash", label: "Cash" },
  { value: "Card", label: "Credit Card" },
];

export default function Payments() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointment");
  const [appointment, setAppointment] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [form, setForm] = useState({ amount: "", method: "" });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!appointmentId) return;
    setLoading(true);

    // 1. Get appointment details
    getAppointmentById(appointmentId)
      .then((appt) => {
        setAppointment(appt);
        // 2. Get all invoices and find the one for this appointment
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

  // Form handling
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Submit/create invoice and mark appointment as paid
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    if (!form.amount || !form.method) {
      setError("Please fill in the amount and select a payment method.");
      setCreating(false);
      return;
    }
    try {
      // 1. Create invoice
      const newInvoice = await createInvoice({
        AppointmentId: Number(appointmentId),
        Amount: Number(form.amount),
        Method: form.method,
        PaymentStatus: true,
      });
      setInvoice(newInvoice);

      // 2. Update appointment status to "Paguar"
      await updateAppointment(appointmentId, { status: "Paguar" });
    
      // 3. Fetch the updated appointment and update local state!
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

  // UI rendering logic
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

      {/* Show invoice if exists, else show form */}
      {invoice ? (
        <InvoiceView invoice={invoice} appointment={appointment} />
      ) : (
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
          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              disabled={creating}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
      )}
    </div>
  );
}

// InvoiceView with CSV Export and Print
function InvoiceView({ invoice, appointment }) {
  const invoiceRef = useRef(null);

  // Export to CSV
  const handleExportCSV = () => {
    const csvHeaders =
        "Invoice ID,Patient,Doctor,Service,Date,Amount,Method,Status\n";
    const csvRow = [
        invoice.invoiceId,
        `${appointment.patientName} ${appointment.patientSurname}`,
        `${appointment.doctorName} ${appointment.doctorSurname}`,
        appointment.serviceName,
        appointment.date && appointment.date !== "0001-01-01"
        ? new Date(appointment.date).toLocaleDateString()
        : "-",
        invoice.amount + " €",
        invoice.method,
        invoice.paymentStatus ? "Paid" : "Unpaid",
    ].join(",");
    const csvContent = csvHeaders + csvRow;

    const BOM = "\uFEFF"; // UTF-8 BOM
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice.csv";
    link.click();
    URL.revokeObjectURL(url);
 };

  // Print only the invoice section
   const handlePrint = () => {
    const printContents = invoiceRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: system-ui, Arial, sans-serif; padding: 2rem; color: #000; background: #fff; }
            /* Additional styles for print */
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };


  return (
    <div className="print-area bg-green-50 rounded shadow p-6" ref={invoiceRef}>
      <div ref={invoiceRef}>
        <h2 className="text-xl font-bold mb-3">Invoice</h2>
      <div>
        <b>Invoice ID:</b> {invoice.invoiceId}
      </div>
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
      <div>
        <b>Amount:</b> {invoice.amount} €
      </div>
      <div>
        <b>Method:</b> {invoice.method}
      </div>
      <div>
        <b>Status:</b>{" "}
        {invoice.paymentStatus ? (
          <span className="text-green-700 font-semibold">Paid</span>
        ) : (
          <span className="text-yellow-700 font-semibold">Unpaid</span>
        )}
      </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleExportCSV}
        >
          Export
        </button>
        <button
          className=" bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
    </div>
  );
}

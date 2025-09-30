import React, { useRef } from "react";

export default function InvoiceView({ invoice, appointment }) {
  const invoiceRef = useRef(null);

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
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printContents = invoiceRef.current.innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: system-ui, Arial, sans-serif;
              padding: 2rem;
              color: #000;
              background: #fff;
            }
            h2 { font-size: 1.5rem; margin-bottom: 1rem; }
            div { margin-bottom: 0.5rem; }
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
    <>
      {/* Print area: Only this gets printed */}
      <div className="print-area bg-green-50 rounded shadow p-6" ref={invoiceRef}>
        <h2 className="text-xl font-bold mb-3">Invoice</h2>
        <div><b>Invoice ID:</b> {invoice.invoiceId}</div>
        <div><b>Patient:</b> {appointment.patientName} {appointment.patientSurname}</div>
        <div><b>Doctor:</b> {appointment.doctorName} {appointment.doctorSurname}</div>
        <div><b>Service:</b> {appointment.serviceName}</div>
        <div>
          <b>Date:</b>{" "}
          {appointment.date && appointment.date !== "0001-01-01"
            ? new Date(appointment.date).toLocaleDateString()
            : "-"}
        </div>
        <div><b>Amount:</b> {invoice.amount} €</div>
        <div><b>Method:</b> {invoice.method}</div>
        <div>
          <b>Status:</b>{" "}
          {invoice.paymentStatus ? (
            <span className="text-green-700 font-semibold">Paid</span>
          ) : (
            <span className="text-yellow-700 font-semibold">Unpaid</span>
          )}
        </div>
      </div>

      {/* These buttons will not be printed */}
      <div className="flex gap-3 mt-5 no-print">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleExportCSV}
        >
          Export
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
    </>
  );
}

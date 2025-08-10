import React from 'react';

export default function InvoiceList({ invoices }) {
  if (!invoices || invoices.length === 0) {
    return <div className="text-gray-500 p-4">No invoices found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Invoice ID</th>
            <th className="px-4 py-2">Patient</th>
            <th className="px-4 py-2">Doctor</th>
            <th className="px-4 py-2">Service</th>
            {/* <th className="px-4 py-2">Date</th> */}
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Method</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.invoiceId} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{inv.invoiceId}</td>
              <td className="px-4 py-2">{inv.patientName} {inv.patientSurname}</td>
              <td className="px-4 py-2">{inv.doctorName} {inv.doctorSurname}</td>
              <td className="px-4 py-2">{inv.serviceName}</td>
              {/* <td className="px-4 py-2">
                {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '-'}
              </td> */}
              <td className="px-4 py-2">{inv.amount} €</td>
              <td className="px-4 py-2">{inv.method}</td>
              <td className="px-4 py-2">
                {inv.paymentStatus ? (
                  <span className="text-green-700 font-semibold">Paid</span>
                ) : (
                  <span className="text-yellow-700 font-semibold">Unpaid</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { getAllInvoices } from '../../api/invoices';
import InvoiceList from '../../shared/InvoiceList';

export default function AllInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ref for print/export area
  const tableRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getAllInvoices()
        .then(data => {
      console.log("Fetched invoices:", data);
      setInvoices(data);
    })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

   // Filter invoices by search query
  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return invoices;
    const q = searchQuery.toLowerCase();
    return invoices.filter(inv => {
      const patient = `${inv.patientName || ''} ${inv.patientSurname || ''}`.toLowerCase();
      const doctor  = `${inv.doctorName || ''} ${inv.doctorSurname || ''}`.toLowerCase();
      const service = (inv.serviceName || '').toLowerCase();
      const status  = inv.paymentStatus ? 'paid' : 'unpaid';

      return (
        patient.includes(q) ||
        doctor.includes(q) ||
        service.includes(q) ||
        status.includes(q)
      );
    });
  }, [invoices, searchQuery]);

  // Export all invoices to CSV
  const handleExportCSV = () => {
    if (!invoices || invoices.length === 0) return;

    // If your invoices contain more/less fields, adjust headers/rows accordingly
    const headers = [
      'Invoice ID',
      'Patient',
      'Doctor',
      'Service',
      //'Date',
      'Amount',
      'Method',
      'Status'
    ];

    const rows = invoices.map(inv => [
      inv.invoiceId,
      `${inv.patientName || ''} ${inv.patientSurname || ''}`,
      `${inv.doctorName || ''} ${inv.doctorSurname || ''}`,
      inv.serviceName,
     //inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '-',
      inv.amount + ' €',
      inv.method,
      inv.paymentStatus ? 'Paid' : 'Unpaid'
    ]);

    // Generate CSV content
    const csvContent =
      [headers.join(','), ...rows.map(r => r.map(cell =>
        typeof cell === 'string' && cell.includes(',') ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(','))]
      .join('\n');

    // Export as CSV
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'all_invoices.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Print (table only)
  const handlePrint = () => {
    if (!tableRef.current) return;
    const printContents = tableRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=700,width=1000');
    printWindow.document.write(`
      <html>
        <head>
          <title>All Invoices</title>
          <style>
            body { font-family: system-ui, Arial, sans-serif; padding: 2rem; color: #000; background: #fff; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h2>All Invoices</h2>
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
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">All Invoices</h1>
      <div className="flex gap-3 mb-4">
         <input
          type="text"
          placeholder="Search invoices..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border rounded p-2 flex-1"
        />
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

      {loading && <div className="text-center py-8">Loading invoices...</div>}
      {error && <div className="text-red-600 text-center py-8">{error}</div>}

      {!loading && !error && (
        <div ref={tableRef}>
           <InvoiceList invoices={filteredInvoices} />
        </div>
      )}
    </div>
  );
}

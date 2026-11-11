"use client";

export default function ReportActions({
  reportId,
  fileName,
  onExportPDF,
}: {
  reportId: string;
  fileName: string;
  onExportPDF?: () => void;
}) {

  function printReport() {

    const report =
      document.getElementById(
        reportId
      );

    if (!report) return;

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=1000,height=800"
      );

    if (!printWindow) return;

    printWindow.document.write(`
      <html>
      <head>

        <title>${fileName}</title>

        <style>

          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }

          h1,
          h2,
          h3 {
            margin-bottom: 10px;
          }

        </style>

      </head>

      <body>

        ${report.innerHTML}

      </body>

      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();
  }

  function exportPDF() {

    if (onExportPDF) {
      onExportPDF();
    }

  }

  return (

    <div className="flex flex-wrap gap-3 mb-6">

      <button
        onClick={printReport}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        🖨 Print Report
      </button>

      <button
        onClick={exportPDF}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        📄 Export PDF
      </button>

    </div>

  );
}
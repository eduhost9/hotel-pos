import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportReportPDF(
  title: string,
  headers: string[],
  rows: any[][]
) {

  const doc = new jsPDF();

  const generatedDate =
    new Date().toLocaleString();

  doc.setFontSize(18);

  doc.text(
    "CHOMA ZONE HOTEL",
    14,
    20
  );

  doc.setFontSize(14);

  doc.text(
    title,
    14,
    30
  );

  doc.setFontSize(10);

  doc.text(
    `Generated: ${generatedDate}`,
    14,
    38
  );

  autoTable(doc, {
    startY: 45,
    head: [headers],
    body: rows,
    styles: {
      fontSize: 9,
    },
    headStyles: {
      fillColor: [22, 163, 74],
    },
  });

  doc.save(
    `${title}.pdf`
  );
}
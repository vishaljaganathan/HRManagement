import jsPDF from 'jspdf';
import 'jspdf-autotable';

const downloadPDF = (data, title, headers) => {
  const doc = new jsPDF();
  doc.text(`${title} Report`, 20, 20);

  // Headers for autoTable
  const head = [headers];

  // Map data to match headers
  const body = data.map(item =>
    headers.map(header => item[`col${headers.indexOf(header) + 1}`] || '')
  );

  doc.autoTable({
    head: head,
    body: body,
  });

  doc.save(`${title}.pdf`);
};

export default downloadPDF;

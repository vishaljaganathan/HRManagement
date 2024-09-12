import React from 'react';
import downloadPDF from '../export/downloadPDF'; // Adjust the import path as needed
import downloadExcel from '../export/downloadExcel'; // Adjust the import path as needed

const MyComponent2 = () => {
  const data = [
    { col1: 'Row 1 Col 1', col2: 'Row 1 Col 2', col3: 'Row 1 Col 3' },
    { col1: 'Row 2 Col 1', col2: 'Row 2 Col 2', col3: 'Row 2 Col 3' },
    // Add more rows as needed
  ];

  return (
    <div>
      <button onClick={() => downloadPDF(data)}>Download PDF</button>
      <button onClick={() => downloadExcel(data)}>Download Excel</button>
    </div>
  );
};

export default MyComponent2;

import * as XLSX from 'xlsx';

const downloadExcel = (data, title, headers) => {
  // Map data to match headers
  const formattedData = data.map(item => {
    const formattedItem = {};
    headers.forEach((header, index) => {
      formattedItem[header] = item[`col${index + 1}`] || '';
    });
    return formattedItem;
  });

  // Create a worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${title}.xlsx`);
};

export default downloadExcel;

import * as XLSX from 'xlsx';

interface Lead {
  id: string;
  [key: string]: any;
}

export const parseFile = (file: Blob): Promise<{ columns: string[], data: Lead[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = new Uint8Array(event.target?.result as ArrayBuffer);
      try {
        let columns: string[] = [];
        let leads: Lead[] = [];
        if (file.type === 'text/csv') {
          const text = new TextDecoder().decode(arrayBuffer);
          const parsedData = parseCSV(text);
          columns = parsedData.columns;
          leads = parsedData.data;
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          const parsedData = parseXLSX(arrayBuffer);
          columns = parsedData.columns;
          leads = parsedData.data;
        } else {
          throw new Error('Unsupported file format');
        }
        resolve({ columns, data: leads });
      } catch (error) {
        console.error(`Failed to parse file: ${error.message}`);
        reject(new Error(`Failed to parse file: ${error.message}`));
      }
    };
    reader.onerror = (error) => {
      console.error(`File reading error: ${error.message}`);
      reject(new Error(`File reading error: ${error.message}`));
    };
    reader.readAsArrayBuffer(file);
  });
};

const parseCSV = (text: string): { columns: string[], data: Lead[] } => {
  const lines = text.split('\n');
  const headers = lines[0].split(',');
  const leads: Lead[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length !== headers.length) {
      console.error(`Row ${i + 1} has incorrect number of columns`);
      throw new Error(`Row ${i + 1} has incorrect number of columns`);
    }
    const lead: Lead = { id: `${i}` };
    headers.forEach((header, index) => {
      lead[header] = values[index];
    });
    leads.push(lead);
  }

  return { columns: headers, data: leads };
};

const parseXLSX = (arrayBuffer: Uint8Array): { columns: string[], data: Lead[] } => {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const headers = json[0] as string[];
  const leads: Lead[] = [];

  for (let i = 1; i < json.length; i++) {
    const values = json[i] as string[];
    if (values.length !== headers.length) {
      console.error(`Row ${i + 1} has incorrect number of columns`);
      throw new Error(`Row ${i + 1} has incorrect number of columns`);
    }
    const lead: Lead = { id: `${i}` };
    headers.forEach((header, index) => {
      lead[header] = values[index];
    });
    leads.push(lead);
  }

  return { columns: headers, data: leads };
};
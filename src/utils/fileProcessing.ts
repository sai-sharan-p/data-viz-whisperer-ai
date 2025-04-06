import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface DataRow {
  [key: string]: string | number | boolean | null;
}

export interface ProcessedData {
  headers: string[];
  data: DataRow[];
  summary: {
    rowCount: number;
    numericColumns: string[];
    categoricalColumns: string[];
    dateColumns: string[];
  };
}

export const processFile = async (file: File): Promise<ProcessedData> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  if (fileExtension === 'csv') {
    return processCSV(file);
  } else if (['xlsx', 'xls', 'xlsm'].includes(fileExtension || '')) {
    return processExcel(file);
  } else {
    throw new Error('Unsupported file format. Please upload a CSV or Excel file.');
  }
};

const processCSV = (file: File): Promise<ProcessedData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
          const headers = results.meta.fields || [];
          const data = results.data as DataRow[];
          
          // Remove empty rows
          const filteredData = data.filter(row => 
            Object.values(row).some(value => value !== null && value !== undefined && value !== '')
          );

          const summary = analyzeSummary(headers, filteredData);
          resolve({
            headers,
            data: filteredData,
            summary
          });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

const processExcel = async (file: File): Promise<ProcessedData> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as DataRow[];
    const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
    
    const summary = analyzeSummary(headers, jsonData);
    
    return {
      headers,
      data: jsonData,
      summary
    };
  } catch (error) {
    throw new Error(`Error processing Excel file: ${error}`);
  }
};

const analyzeSummary = (headers: string[], data: DataRow[]) => {
  const numericColumns: string[] = [];
  const categoricalColumns: string[] = [];
  const dateColumns: string[] = [];
  
  headers.forEach(header => {
    // Sample up to 100 non-null values to determine type
    const sampleValues = data
      .slice(0, Math.min(data.length, 100))
      .map(row => row[header])
      .filter(value => value !== null && value !== undefined && value !== '');
    
    if (sampleValues.length === 0) {
      categoricalColumns.push(header);
      return;
    }
    
    // Check if all sampled values are numbers
    const allNumbers = sampleValues.every(value => 
      typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))
    );
    
    if (allNumbers) {
      numericColumns.push(header);
      return;
    }
    
    // Check if values look like dates
    const datePattern = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\w{3}\s\d{1,2},?\s\d{4}/;
    const mightBeDates = sampleValues.every(value => 
      typeof value === 'string' && datePattern.test(value)
    );
    
    if (mightBeDates) {
      dateColumns.push(header);
      return;
    }
    
    // Otherwise treat as categorical
    categoricalColumns.push(header);
  });
  
  return {
    rowCount: data.length,
    numericColumns,
    categoricalColumns,
    dateColumns
  };
};

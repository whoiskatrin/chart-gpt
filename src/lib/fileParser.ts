import Papa from 'papaparse';

export interface ParsedData {
  data: Record<string, any>[];
  columns: string[];
  fileName: string;
  fileType: string;
}

export interface FileParseResult {
  success: boolean;
  data?: ParsedData;
  error?: string;
}

export class FileParser {
  static async parseFile(file: File): Promise<FileParseResult> {
    try {
      const fileName = file.name;
      const fileType = this.getFileType(fileName);
      
      switch (fileType) {
        case 'csv':
          return await this.parseCSV(file, fileName, fileType);
        case 'json':
          return await this.parseJSON(file, fileName, fileType);
        case 'txt':
          return await this.parseTXT(file, fileName, fileType);
        case 'tsv':
          return await this.parseTSV(file, fileName, fileType);
        default:
          return {
            success: false,
            error: `Unsupported file type: ${fileType}. Supported formats: CSV, JSON, TXT, TSV`
          };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private static getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension || '';
  }

  private static async parseCSV(file: File, fileName: string, fileType: string): Promise<FileParseResult> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        transform: (value: string) => {
          // Try to convert numbers
          const numValue = Number(value);
          if (!isNaN(numValue) && value.trim() !== '') {
            return numValue;
          }
          return value;
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            resolve({
              success: false,
              error: `CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`
            });
            return;
          }

          const data = results.data as Record<string, any>[];
          const columns = Object.keys(data[0] || {});
          
          resolve({
            success: true,
            data: {
              data,
              columns,
              fileName,
              fileType
            }
          });
        },
        error: (error) => {
          resolve({
            success: false,
            error: `CSV parsing failed: ${error.message}`
          });
        }
      });
    });
  }

  private static async parseTSV(file: File, fileName: string, fileType: string): Promise<FileParseResult> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        delimiter: '\t',
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        transform: (value: string) => {
          const numValue = Number(value);
          if (!isNaN(numValue) && value.trim() !== '') {
            return numValue;
          }
          return value;
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            resolve({
              success: false,
              error: `TSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`
            });
            return;
          }

          const data = results.data as Record<string, any>[];
          const columns = Object.keys(data[0] || {});
          
          resolve({
            success: true,
            data: {
              data,
              columns,
              fileName,
              fileType
            }
          });
        },
        error: (error) => {
          resolve({
            success: false,
            error: `TSV parsing failed: ${error.message}`
          });
        }
      });
    });
  }

  private static async parseJSON(file: File, fileName: string, fileType: string): Promise<FileParseResult> {
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      let data: Record<string, any>[];
      
      if (Array.isArray(jsonData)) {
        data = jsonData;
      } else if (typeof jsonData === 'object' && jsonData !== null) {
        // If it's an object, try to find arrays within it or convert to single item array
        const arrayKeys = Object.keys(jsonData).filter(key => Array.isArray(jsonData[key]));
        if (arrayKeys.length > 0) {
          data = jsonData[arrayKeys[0]];
        } else {
          data = [jsonData];
        }
      } else {
        return {
          success: false,
          error: 'JSON must contain an array of objects or an object with array properties'
        };
      }

      if (data.length === 0) {
        return {
          success: false,
          error: 'File contains no data'
        };
      }

      const columns = Object.keys(data[0] || {});

      return {
        success: true,
        data: {
          data,
          columns,
          fileName,
          fileType
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `JSON parsing failed: ${error instanceof Error ? error.message : 'Invalid JSON format'}`
      };
    }
  }

  private static async parseTXT(file: File, fileName: string, fileType: string): Promise<FileParseResult> {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        return {
          success: false,
          error: 'Text file is empty'
        };
      }

      // Try to detect if it's delimiter-separated
      const firstLine = lines[0];
      let delimiter = '';
      
      if (firstLine.includes('\t')) {
        delimiter = '\t';
      } else if (firstLine.includes(',')) {
        delimiter = ',';
      } else if (firstLine.includes(';')) {
        delimiter = ';';
      } else if (firstLine.includes('|')) {
        delimiter = '|';
      }

      if (delimiter) {
        // Parse as delimited data
        return new Promise((resolve) => {
          Papa.parse(text, {
            header: true,
            delimiter,
            skipEmptyLines: true,
            transformHeader: (header: string) => header.trim(),
            transform: (value: string) => {
              const numValue = Number(value);
              if (!isNaN(numValue) && value.trim() !== '') {
                return numValue;
              }
              return value;
            },
            complete: (results) => {
              const data = results.data as Record<string, any>[];
              const columns = Object.keys(data[0] || {});
              
              resolve({
                success: true,
                data: {
                  data,
                  columns,
                  fileName,
                  fileType
                }
              });
            }
          });
        });
      } else {
        // Treat as simple text data - create a single column
        const data = lines.map((line, index) => ({
          line: index + 1,
          text: line.trim()
        }));

        return {
          success: true,
          data: {
            data,
            columns: ['line', 'text'],
            fileName,
            fileType
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Text file parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  static generateDataSummary(parsedData: ParsedData): string {
    const { data, columns, fileName } = parsedData;
    const rowCount = data.length;
    const columnCount = columns.length;
    
    // Sample a few rows for preview
    const sampleSize = Math.min(3, data.length);
    const sampleData = data.slice(0, sampleSize);
    
    let summary = `File: ${fileName}\n`;
    summary += `Rows: ${rowCount}, Columns: ${columnCount}\n`;
    summary += `Columns: ${columns.join(', ')}\n\n`;
    summary += `Sample data:\n`;
    
    sampleData.forEach((row, index) => {
      summary += `Row ${index + 1}: ${JSON.stringify(row)}\n`;
    });
    
    if (data.length > sampleSize) {
      summary += `... and ${data.length - sampleSize} more rows`;
    }
    
    return summary;
  }
}
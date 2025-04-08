
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProcessedData } from "@/utils/fileProcessing";

interface DataTableProps {
  processedData: ProcessedData;
}

const DataTable = ({ processedData }: DataTableProps) => {
  const { headers, data } = processedData;
  
  // Limit the number of rows to display to prevent performance issues
  const MAX_ROWS = 100;
  const displayData = data.slice(0, MAX_ROWS);
  
  return (
    <div className="border rounded-md w-full overflow-hidden">
      <ScrollArea className="h-[300px]">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header} className="font-semibold whitespace-nowrap">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={`${rowIndex}-${header}`} className="py-2 whitespace-nowrap">
                      {row[header] !== undefined ? String(row[header]) : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {data.length > MAX_ROWS && (
          <div className="py-2 text-center text-sm text-muted-foreground">
            Showing {MAX_ROWS} of {data.length} rows
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default DataTable;

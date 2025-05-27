
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
    <div className="w-full">
      <div className="border rounded-md overflow-hidden bg-white">
        <ScrollArea className="h-[400px] w-full">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-navy-50 sticky top-0 z-10">
                <TableRow>
                  {headers.map((header) => (
                    <TableHead key={header} className="font-semibold whitespace-nowrap min-w-[150px] px-4 py-3 text-navy-700 border-r border-navy-200 last:border-r-0 bg-navy-50">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-navy-25">
                    {headers.map((header) => (
                      <TableCell key={`${rowIndex}-${header}`} className="py-3 px-4 whitespace-nowrap min-w-[150px] border-r border-slate-200 last:border-r-0 text-sm max-w-[200px] overflow-hidden text-ellipsis">
                        {row[header] !== undefined ? String(row[header]) : ''}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
        
        {data.length > MAX_ROWS && (
          <div className="py-2 text-center text-sm text-muted-foreground bg-slate-50 border-t">
            Showing {MAX_ROWS} of {data.length} rows
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;

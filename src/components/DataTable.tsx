import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProcessedData } from "@/utils/fileProcessing";

interface DataTableProps {
  processedData: ProcessedData;
}

const DataTable = ({ processedData }: DataTableProps) => {
  const { headers, data } = processedData;
  
  // Limit to 5 rows for preview
  const displayData = data.slice(0, 5);
  
  return (
    <div className="w-full">
      <div className="border rounded-md overflow-hidden bg-white">
        <ScrollArea className="h-[300px]">
          <div className="w-full overflow-auto">
            <div className="min-w-max">
              <Table>
                <TableHeader className="bg-navy-50 sticky top-0 z-10">
                  <TableRow>
                    {headers.map((header) => (
                      <TableHead 
                        key={header} 
                        className="font-semibold whitespace-nowrap px-4 py-3 text-navy-700 border-r border-navy-200 last:border-r-0 bg-navy-50"
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayData.map((row, rowIndex) => (
                    <TableRow key={rowIndex} className="hover:bg-navy-25">
                      {headers.map((header) => (
                        <TableCell 
                          key={`${rowIndex}-${header}`} 
                          className="py-3 px-4 whitespace-nowrap border-r border-slate-200 last:border-r-0 text-sm"
                        >
                          {row[header] !== undefined ? String(row[header]) : ''}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ScrollArea>
        
        <div className="py-2 text-center text-sm text-muted-foreground bg-slate-50 border-t">
          Showing 5 of {data.length} rows
        </div>
      </div>
    </div>
  );
};

export default DataTable;
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  headers?: string[];
}

export function TableSkeleton({
  columns = 6,
  rows = 5,
  headers,
}: TableSkeletonProps) {
  const colCount = headers ? headers.length : columns;

  return (
    <div className="rounded-xl border border-border/40 bg-card/40 overflow-hidden">
      <Table>
        {headers && (
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              {headers.map((h, i) => (
                <TableHead
                  key={i}
                  className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {Array.from({ length: rows }).map((_, rIdx) => (
            <TableRow
              key={rIdx}
              className="border-border/30 hover:bg-muted/10 transition-colors"
            >
              {Array.from({ length: colCount }).map((_, cIdx) => (
                <TableCell key={cIdx} className="py-3.5">
                  <Skeleton
                    className={`h-4 ${
                      cIdx === 0
                        ? "w-20"
                        : cIdx === 1
                        ? "w-32"
                        : cIdx === colCount - 1
                        ? "w-24 ml-auto"
                        : "w-28"
                    } bg-muted/60`}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

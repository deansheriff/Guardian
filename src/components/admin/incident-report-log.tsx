"use client"

import React, { useMemo, useState } from 'react';
import { useIncidentReport } from '@/context/incident-report-context';
import { Incident } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';

const IncidentReportLog = () => {
  const { reports } = useIncidentReport();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Incident>[] = useMemo(() => [
    {
      accessorKey: 'guardName',
      header: 'Guard',
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
        accessorKey: 'timestamp',
        header: 'Timestamp',
        cell: ({ row }) => format(new Date(row.original.timestamp), 'PPP p'),
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <p className="truncate max-w-xs">{row.original.description}</p>
    },
    {
        accessorKey: 'severity',
        header: 'Severity',
        cell: ({ row }) => {
            const severity = row.original.severity || 'low';
            return (
                <Badge variant={severity === 'high' ? 'destructive' : severity === 'medium' ? 'secondary' : 'default'}>
                    {severity}
                </Badge>
            )
        }
    }
  ], []);

  const table = useReactTable({
    data: reports,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
        sorting,
        columnFilters,
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Reports</CardTitle>
        <CardDescription>A log of all submitted incident reports from guards.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center py-4">
            <Input
                placeholder="Filter by guard name..."
                value={(table.getColumn('guardName')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                    table.getColumn('guardName')?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
            />
        </div>
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map(row => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Next
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentReportLog;
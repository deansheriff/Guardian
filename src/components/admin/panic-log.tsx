'use client';

import { useEffect, useState, useMemo } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { PanicAlert } from '@/lib/types';
import { supabase } from '@/lib/db';
import { useData } from '@/context/data-context';

export default function PanicLog() {
    const [alerts, setAlerts] = useState<PanicAlert[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const { locations } = useData();

    useEffect(() => {
        const fetchAlerts = async () => {
            const { data, error } = await supabase.from('panic_alerts').select('*').order('timestamp', { ascending: false });
            if (error) console.error('Error fetching panic alerts:', error);
            else setAlerts(data as PanicAlert[]);
        };
        fetchAlerts();
    }, []);

    const getLocationName = (locationId: string) => {
        return locations.find(l => l.id === locationId)?.name || 'Unknown';
    }

    const columns: ColumnDef<PanicAlert>[] = useMemo(() => [
        {
            accessorKey: 'guardName',
            header: 'Guard',
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: ({ row }) => getLocationName(row.original.location),
        },
        {
            accessorKey: 'timestamp',
            header: 'Timestamp',
            cell: ({ row }) => format(new Date(row.original.timestamp), 'PPP p'),
        },
    ], [locations]);

    const table = useReactTable({
        data: alerts,
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
        <div>
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
                                    No panic alerts found.
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
        </div>
    )
}
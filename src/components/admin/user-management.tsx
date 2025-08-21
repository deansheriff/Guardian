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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { MapPin, PlusCircle, Clock, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AddUserForm } from './add-user-form';
import { User, Location } from '@/lib/types';
import { useData } from '@/context/data-context';
import { useShifts } from '@/context/shift-context';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


export function UserManagement() {
    const { users, locations, refetchData } = useData();
    const { shifts } = useShifts();
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const refreshUsers = () => {
        refetchData();
        setIsAddUserOpen(false);
        setEditingUser(null);
    }
    
    const getLocationName = (location_id?: string) => {
        if (!location_id) return 'N/A';
        return locations.find(loc => loc.id === location_id)?.name || 'Unknown Location';
    }

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        await fetch(`/api/users/${userToDelete}`, { method: 'DELETE' });
        refetchData();
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsAddUserOpen(true);
    };

    const openDeleteDialog = (userId: string) => {
        setUserToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

    const columns: ColumnDef<User>[] = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                            {user.image_url ? <Image src={user.image_url} alt={user.name} width={40} height={40} className="object-cover" /> : <div className="text-sm font-semibold">{user.name.charAt(0)}</div>}
                        </div>
                        <span className="font-medium">{user.name}</span>
                    </div>
                )
            }
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => <Badge variant={row.original.role === 'admin' ? 'default' : 'secondary'} className='capitalize'>{row.original.role}</Badge>
        },
        {
            accessorKey: 'rank',
            header: 'Rank',
            cell: ({ row }) => row.original.role === 'guard' ? <Badge variant="outline" className='capitalize'>{row.original.rank}</Badge> : 'N/A'
        },
        {
            id: 'location',
            header: 'Assigned Location',
            cell: ({ row }) => {
                const user = row.original;
                return user.role === 'guard' ? (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">{getLocationName(user.location_id)}</span>
                    </div>
                ) : 'N/A'
            }
        },
        {
            id: 'shift',
            header: 'Shift Hours',
            cell: ({ row }) => {
                const user = row.original;
                const userShift = shifts.find(shift => shift.guardid === user.id);
                return user.role === 'guard' && userShift ? (
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">{userShift.startTime} - {userShift.endTime}</span>
                    </div>
                ) : 'N/A'
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog(user.id)} disabled={user.role === 'admin'}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ], [locations, shifts]);

    const table = useReactTable({
        data: users,
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
            <CardHeader className='flex flex-row justify-between items-center'>
                <div>
                    <CardTitle>User Accounts</CardTitle>
                    <CardDescription>Manage administrator and guard accounts.</CardDescription>
                </div>
                <Dialog open={isAddUserOpen} onOpenChange={(isOpen) => {
                    setIsAddUserOpen(isOpen);
                    if (!isOpen) {
                        setEditingUser(null);
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingUser(null)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <AddUserForm onUserAdded={refreshUsers} userToEdit={editingUser} />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter by name..."
                        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                        onChange={(event) =>
                            table.getColumn('name')?.setFilterValue(event.target.value)
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
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the user account.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteUser}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
         </Card>
     );
}

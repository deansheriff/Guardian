'use client';

import { useEffect, useState } from 'react';
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
import { MapPin, PlusCircle, Clock, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AddUserForm } from './add-user-form';
import { getMockLocations, getMockUsers, User, Location, saveMockUsers } from '@/lib/mock-data';

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    
    const refreshUsers = () => {
        setUsers(getMockUsers());
        setIsAddUserOpen(false);
        setEditingUser(null);
    }
    
    useEffect(() => {
        setUsers(getMockUsers());
        setLocations(getMockLocations());
    }, []);

    const getLocationName = (locationId?: string) => {
        if (!locationId) return 'N/A';
        return locations.find(loc => loc.id === locationId)?.name || 'Unknown Location';
    }

    const handleDeleteUser = (userId: string) => {
        const updatedUsers = users.filter(user => user.id !== userId);
        saveMockUsers(updatedUsers);
        setUsers(updatedUsers);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsAddUserOpen(true);
    };
 
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
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                            <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
                        </DialogHeader>
                        <AddUserForm onUserAdded={refreshUsers} userToEdit={editingUser} />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Assigned Location</TableHead>
                                <TableHead>Shift Hours</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium whitespace-nowrap">{user.name}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className='capitalize'>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.role === 'guard' ? (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-xs">{getLocationName(user.locationId)}</span>
                                            </div>
                                        ) : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {user.role === 'guard' && user.shift ? (
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-xs">{user.shift.start} - {user.shift.end}</span>
                                            </div>
                                        ) : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                       <div className="flex items-center gap-2">
                                           <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                                               <Pencil className="h-4 w-4" />
                                           </Button>
                                           <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} disabled={user.role === 'admin'}>
                                               <Trash2 className="h-4 w-4" />
                                           </Button>
                                       </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

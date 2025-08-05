'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getMockLocations, getMockUsers, saveMockUsers, User, Location } from '@/lib/mock-data';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }).optional().or(z.literal('')),
  role: z.enum(['admin', 'guard']),
  locationId: z.string().optional(),
  shift: z.object({
    start: z.string(),
    end: z.string(),
  }).optional(),
}).refine(data => {
    if (data.role === 'guard' && (!data.locationId || !data.shift)) {
        return false;
    }
    return true;
}, {
    message: "Guards must have an assigned location and shift.",
    path: ['role'],
});

const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
        options.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return options;
}

export function AddUserForm({ onUserAdded, userToEdit }: { onUserAdded: () => void, userToEdit: User | null }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const timeOptions = generateTimeOptions();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'guard',
      shift: { start: '09:00', end: '17:00' },
    },
  });
 
   const role = form.watch('role');
   
   useEffect(() => {
     setLocations(getMockLocations());
     if (userToEdit) {
       form.reset({
         id: userToEdit.id,
         name: userToEdit.name,
         email: userToEdit.email,
         password: '',
         role: userToEdit.role,
         locationId: userToEdit.locationId,
         shift: userToEdit.shift,
       });
     }
   }, [userToEdit, form]);
 
 
   async function onSubmit(values: z.infer<typeof formSchema>) {
     setIsLoading(true);
 
     await new Promise(resolve => setTimeout(resolve, 1000));
     
     const currentUsers = getMockUsers();
     
     if (userToEdit) {
        const updatedUsers = currentUsers.map(user => {
            if (user.id === userToEdit.id) {
                return {
                    ...user,
                    ...values,
                    password: values.password ? values.password : user.password,
                };
            }
            return user;
        });
        saveMockUsers(updatedUsers);
        toast({
            title: 'User Updated',
            description: `User ${values.name} has been successfully updated.`,
        });
     } else {
        const newUser: User = {
            id: (currentUsers.length + 1).toString(),
            password: values.password,
            name: values.name,
            email: values.email,
            role: values.role,
            ...(values.role === 'guard' && {
                locationId: values.locationId,
                shift: values.shift,
            })
        };
        saveMockUsers([...currentUsers, newUser]);
        toast({
          title: 'User Created',
          description: `User ${values.name} has been successfully created.`,
        });
     }
     
     setIsLoading(false);
     form.reset();
     onUserAdded();
   }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="guard">Guard</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {role === 'guard' && (
            <>
                <FormField
                    control={form.control}
                    name="locationId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Assigned Location</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {locations.map(loc => <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="shift.start"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Shift Start</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Start time" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {timeOptions.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="shift.end"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Shift End</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="End time" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {timeOptions.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
                <UserPlus className="mr-2" />
                {userToEdit ? 'Save Changes' : 'Add User'}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

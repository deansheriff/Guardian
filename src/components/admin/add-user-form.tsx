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
import { User, Location } from '@/lib/mock-data';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }).optional().or(z.literal('')),
  role: z.enum(['admin', 'guard']),
  locationId: z.string().optional(),
  rank: z.enum(['Rookie', 'Veteran', 'Elite']).optional(),
  imageUrl: z.string().optional(),
}).refine(data => {
    if (data.role === 'guard' && (!data.locationId || !data.rank)) {
        return false;
    }
    return true;
}, {
    message: "Guards must have an assigned location, shift and rank.",
    path: ['role'],
});

const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
        options.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return options;
}

export function AddUserForm({ onUserAdded, userToEdit, isAdmin = false }: { onUserAdded: () => void, userToEdit: User | null, isAdmin?: boolean }) {
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
      role: isAdmin ? 'admin' : 'guard',
      rank: 'Rookie',
      imageUrl: '',
    },
  });
 
   const role = form.watch('role');
   
   useEffect(() => {
     async function fetchLocations() {
        const res = await fetch('/api/locations');
        const data = await res.json();
        setLocations(data);
     }
     fetchLocations();
     if (userToEdit) {
       form.reset({
         id: userToEdit.id,
         name: userToEdit.name,
         email: userToEdit.email,
         password: '',
         role: userToEdit.role,
         locationId: userToEdit.locationId,
         rank: userToEdit.rank,
         imageUrl: userToEdit.imageUrl,
       });
     }
   }, [userToEdit, form]);
 
 
   async function onSubmit(values: z.infer<typeof formSchema>) {
     setIsLoading(true);
 
      const method = userToEdit ? 'PUT' : 'POST';
      const url = userToEdit ? `/api/users/${userToEdit.id}` : '/api/users';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: userToEdit ? 'User Updated' : 'User Created',
          description: `User ${values.name} has been successfully ${userToEdit ? 'updated' : 'created'}.`,
        });
        form.reset();
        onUserAdded();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Something went wrong.',
        });
      }
     
     setIsLoading(false);
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
         {!isAdmin && <FormField
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
        />}

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
                 <FormField
                    control={form.control}
                    name="rank"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Guard Rank</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a rank" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Rookie">Rookie</SelectItem>
                                <SelectItem value="Veteran">Veteran</SelectItem>
                                <SelectItem value="Elite">Elite</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Profile Image</FormLabel>
                        <FormControl>
                            <Input type="file" onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    const file = e.target.files[0];
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        form.setValue('imageUrl', reader.result as string);
                                    }
                                    reader.readAsDataURL(file);
                                }
                            }}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

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

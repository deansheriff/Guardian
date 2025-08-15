'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';
import { Buffer } from 'buffer';

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
import { Loader2, UserPlus, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, Location } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import Image from 'next/image';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }).optional().or(z.literal('')),
  role: z.enum(['admin', 'guard']),
  location_id: z.string().optional(),
  rank: z.enum(['Rookie', 'Veteran', 'Elite']).optional(),
  image_url: z.any().optional(),
}).refine(data => {
    if (data.role === 'guard' && (!data.location_id || !data.rank)) {
        return false;
    }
    return true;
}, {
    message: "Guards must have an assigned location and rank.",
    path: ['role'],
});

export function AddUserForm({ onUserAdded, userToEdit, isAdmin = false }: { onUserAdded: () => void, userToEdit: User | null, isAdmin?: boolean }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: isAdmin ? 'admin' : 'guard',
      rank: 'Rookie',
      image_url: null,
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
         location_id: userToEdit.location_id,
         rank: userToEdit.rank,
         image_url: userToEdit.image_url,
       });
       if (userToEdit.image_url) {
         setImagePreview(userToEdit.image_url);
       }
     }
   }, [userToEdit, form]);
 
   async function uploadProfileImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    const { data, error } = await supabase.storage.from('guardian-storage').upload(filePath, file);

    if (error) {
        throw error;
    }

    const { data: { publicUrl } } = supabase.storage.from('guardian-storage').getPublicUrl(filePath);
    return publicUrl;
   }
 
   async function onSubmit(values: z.infer<typeof formSchema>) {
     setIsLoading(true);
 
      try {
        let imageUrl = userToEdit?.image_url;
        if (values.image_url && values.image_url instanceof File) {
            imageUrl = await uploadProfileImage(values.image_url);
        }

        const userData = { ...values, image_url: imageUrl };

        const method = userToEdit ? 'PUT' : 'POST';
        const url = userToEdit ? `/api/users/${userToEdit.id}` : '/api/auth/signup';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            toast({
            title: userToEdit ? 'User Updated' : 'User Created',
            description: `User ${values.name} has been successfully ${userToEdit ? 'updated' : 'created'}.`,
            });
            form.reset();
            setImagePreview(null);
            onUserAdded();
        } else {
            const { error } = await response.json();
            toast({
            variant: 'destructive',
            title: 'Error',
            description: error || 'Something went wrong.',
            });
        }
      } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'Something went wrong.',
        });
      }
     
     setIsLoading(false);
   }

  return (
    <Card>
        <CardHeader>
            <CardTitle>{userToEdit ? 'Edit User' : 'Add New User'}</CardTitle>
            <CardDescription>
                {userToEdit ? 'Update the details of the existing user.' : 'Fill in the form to add a new user to the system.'}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., John Doe" {...field} />
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
                                <Input type="email" placeholder="user@example.com" {...field} />
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
                                <Input type="password" placeholder={userToEdit ? "Leave blank to keep current password" : "••••••••"} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="space-y-6">
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
                                    name="location_id"
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
                            </>
                        )}
                         <FormField
                            control={form.control}
                            name="image_url"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Profile Image</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                            {imagePreview ? (
                                                <Image src={imagePreview} alt="Avatar preview" width={96} height={96} className="object-cover w-full h-full" />
                                            ) : (
                                                <UserPlus className="w-10 h-10 text-muted-foreground" />
                                            )}
                                        </div>
                                        <Button type="button" variant="outline" asChild>
                                            <label htmlFor="file-upload" className="cursor-pointer">
                                                <Upload className="w-4 h-4 mr-2" />
                                                <span>Upload</span>
                                                <input id="file-upload" type="file" className="sr-only" onChange={(e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        const file = e.target.files[0];
                                                        field.onChange(file);
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setImagePreview(reader.result as string);
                                                        }
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}/>
                                            </label>
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                )}
                {userToEdit ? 'Save Changes' : 'Create User'}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}

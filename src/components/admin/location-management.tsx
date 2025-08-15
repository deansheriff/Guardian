'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Location } from '@/lib/types';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, PlusCircle, Trash2, LocateFixed, Edit } from 'lucide-react';
import { supabase } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
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

export function LocationManagement() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);

  const refreshLocations = useCallback(async () => {
    const { data, error } = await supabase.from('locations').select('*').order('name');
    if (error) console.error('Error fetching locations:', error);
    else setLocations(data as Location[]);
    setIsFormOpen(false);
    setEditingLocation(null);
  }, []);

  useEffect(() => {
    refreshLocations();
  }, [refreshLocations]);

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (locationId: string) => {
    setLocationToDelete(locationId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteLocation = async () => {
    if (!locationToDelete) return;
    await supabase.from('locations').delete().eq('id', locationToDelete);
    refreshLocations();
    if (selectedLocation?.id === locationToDelete) {
        setSelectedLocation(null);
    }
    setIsDeleteDialogOpen(false);
    setLocationToDelete(null);
  };

  const center = useMemo(() => ({
    lat: selectedLocation?.latitude ?? 37.7749,
    lng: selectedLocation?.longitude ?? -122.4194
  }), [selectedLocation]);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Manage Locations</CardTitle>
          <CardDescription>Add, view, or remove designated patrol locations.</CardDescription>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
            setIsFormOpen(isOpen);
            if (!isOpen) setEditingLocation(null);
        }}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Location
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{editingLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
                    <DialogDescription>
                        {editingLocation ? 'Update the details for this location.' : 'Click on the map to set a location pin, then give it a name and save it.'}
                    </DialogDescription>
                </DialogHeader>
                <AddLocationForm onLocationAdded={refreshLocations} locationToEdit={editingLocation} />
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
            <Input placeholder="Search locations..." className="max-w-sm" />
            <div className="rounded-md border overflow-y-auto h-[400px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {locations.map((location) => (
                            <TableRow 
                                key={location.id} 
                                onClick={() => setSelectedLocation(location)}
                                className={`cursor-pointer ${selectedLocation?.id === location.id ? 'bg-muted/50' : ''}`}
                            >
                                <TableCell className="font-medium">{location.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEditLocation(location); }}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openDeleteDialog(location.id); }}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
        <div className="rounded-lg overflow-hidden h-[465px]">
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                <Map
                    defaultCenter={center}
                    center={center}
                    defaultZoom={12}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    mapId="guardian_map"
                >
                    {locations.map(loc => <AdvancedMarker key={loc.id} position={{ lat: loc.latitude, lng: loc.longitude }} onClick={() => setSelectedLocation(loc)} />)}
                    <MapControl onMyLocation={(pos) => setSelectedLocation(locations.find(l => l.latitude === pos.lat && l.longitude === pos.lng) || {id: 'current', name: 'Current Location', latitude: pos.lat, longitude: pos.lng})} />
                </Map>
            </APIProvider>
        </div>
      </CardContent>
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the location.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteLocation}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </Card>
  );
}


function AddLocationForm({ onLocationAdded, locationToEdit }: { onLocationAdded: () => void, locationToEdit: Location | null }) {
    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
    const [locationName, setLocationName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (locationToEdit) {
            setLocationName(locationToEdit.name);
            setMarker({ lat: locationToEdit.latitude, lng: locationToEdit.longitude });
        }
    }, [locationToEdit]);

    const handleMapClick = (e: { detail: { latLng: google.maps.LatLngLiteral | null } }) => {
        if (e.detail.latLng) {
            setMarker(e.detail.latLng);
        }
    };
    
    const handleSaveLocation = async () => {
        if(!marker || !locationName.trim()){
            toast({ variant: 'destructive', title: 'Error', description: 'Please set a pin on the map and provide a location name.'});
            return;
        }
        
        setIsLoading(true);
        const locationData: Omit<Location, 'created_at'> = {
            id: locationToEdit?.id || uuidv4(),
            name: locationName,
            latitude: marker.lat,
            longitude: marker.lng,
            radius: 30,
        };

        const { error } = locationToEdit
            ? await supabase.from('locations').update(locationData).eq('id', locationToEdit.id)
            : await supabase.from('locations').insert([locationData]);

        if (!error) {
            toast({ title: `Location ${locationToEdit ? 'Updated' : 'Saved'}`, description: `${locationName} has been ${locationToEdit ? 'updated' : 'added'}.`});
            onLocationAdded();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong.'});
        }
        setIsLoading(false);
    }

    return (
        <div className="space-y-4">
             <div className="relative h-96 rounded-lg overflow-hidden">
                <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                    <Map
                        defaultCenter={locationToEdit ? {lat: locationToEdit.latitude, lng: locationToEdit.longitude} : {lat: 37.7749, lng: -122.4194}}
                        defaultZoom={12}
                        gestureHandling={'greedy'}
                        onClick={handleMapClick}
                        mapId="add_location_map"
                    >
                        {marker && <AdvancedMarker position={marker} />}
                    </Map>
                    <MapControl onMyLocation={setMarker} />
                </APIProvider>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 items-end'>
                <div className='sm:col-span-2 space-y-2'>
                    <label htmlFor="locationName" className='text-sm font-medium'>Location Name</label>
                    <Input id="locationName" placeholder="e.g., Main Office Rooftop" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
                </div>
                <Button onClick={handleSaveLocation} disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <><MapPin className='mr-2' /> {locationToEdit ? 'Update' : 'Save'} Location</> }
                </Button>
            </div>
        </div>
    );
}

function MapControl({ onMyLocation }: { onMyLocation: (pos: {lat: number, lng: number}) => void }) {
    const map = useMap();
    const { toast } = useToast();

    const handleMyLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                onMyLocation(pos);
                map?.panTo(pos);
                map?.setZoom(15);
            }, (error) => {
                let description = 'The Geolocation service failed.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        description = "Location access was denied. Please enable it in your browser settings.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        description = "Your location information is currently unavailable.";
                        break;
                    case error.TIMEOUT:
                        description = "The request to get your location timed out.";
                        break;
                }
                toast({ variant: 'destructive', title: 'Error', description });
            });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Your browser\'s geolocation is not supported.' });
        }
    }, [map, onMyLocation, toast]);

    return (
        <Button onClick={handleMyLocation} size="icon" className="absolute top-2 right-2">
            <LocateFixed />
        </Button>
    );
}

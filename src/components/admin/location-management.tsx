'use client';

import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMockLocations, saveMockLocations, Location } from '@/lib/mock-data';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, PlusCircle, Trash2, LocateFixed } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: 'var(--radius)',
};

const center = {
  lat: 37.7749,
  lng: -122.4194
};

const libraries: "places"[] = ['places'];

export function LocationManagement() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  
  const refreshLocations = useCallback(() => {
    setLocations(getMockLocations());
    setIsAddLocationOpen(false);
  }, []);

  useEffect(() => {
    refreshLocations();
  }, [refreshLocations]);
  
  const handleDeleteLocation = (id: string) => {
    const currentLocations = getMockLocations();
    const updatedLocations = currentLocations.filter(loc => loc.id !== id);
    saveMockLocations(updatedLocations);
    refreshLocations();
  }


  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Manage Locations</CardTitle>
          <CardDescription>Add, view, or remove designated patrol locations.</CardDescription>
        </div>
        <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Location
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add New Location</DialogTitle>
                    <DialogDescription>Click on the map to set a location pin, then give it a name and save it.</DialogDescription>
                </DialogHeader>
                <AddLocationForm onLocationAdded={refreshLocations} />
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Coordinates</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {locations.map((location) => (
                        <TableRow key={location.id}>
                            <TableCell className="font-medium">{location.name}</TableCell>
                            <TableCell>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteLocation(location.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
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


function AddLocationForm({ onLocationAdded }: { onLocationAdded: () => void }) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
    const [locationName, setLocationName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }
    };

    const handleMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setMarker(pos);
                map?.panTo(pos);
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
            toast({ variant: 'destructive', title: 'Error', description: 'Your browser doesn\'t support geolocation.' });
        }
    };
    
    const handleSaveLocation = () => {
        if(!marker || !locationName.trim()){
            toast({ variant: 'destructive', title: 'Error', description: 'Please set a pin on the map and provide a location name.'});
            return;
        }
        
        setIsLoading(true);
        //Simulate API call
        setTimeout(() => {
            const currentLocations = getMockLocations();
            const newLocation: Location = {
                id: (currentLocations.length + 1).toString(),
                name: locationName,
                latitude: marker.lat,
                longitude: marker.lng,
                radius: 30,
            };
            saveMockLocations([...currentLocations, newLocation]);
            toast({ title: 'Location Saved', description: `${locationName} has been added.`});
            setIsLoading(false);
            onLocationAdded();
        }, 1000);

    }

    if (loadError) return <div>Error loading maps. Make sure your API key is configured correctly.</div>;
    if (!isLoaded) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-4">
             <div className="relative">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={12}
                    onClick={handleMapClick}
                    onLoad={setMap}
                >
                    {marker && <MarkerF position={marker} />}
                </GoogleMap>
                <Button onClick={handleMyLocation} size="icon" className="absolute top-2 right-2">
                    <LocateFixed />
                </Button>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 items-end'>
                <div className='sm:col-span-2 space-y-2'>
                    <label htmlFor="locationName" className='text-sm font-medium'>Location Name</label>
                    <Input id="locationName" placeholder="e.g., Main Office Rooftop" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
                </div>
                <Button onClick={handleSaveLocation} disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <><MapPin className='mr-2' /> Save Location</> }
                </Button>
            </div>
        </div>
    );
}

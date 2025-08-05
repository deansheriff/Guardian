export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'guard';
  locationId?: string;
  shift?: {
    start: string; // e.g., "09:00"
    end: string;   // e.g., "17:00"
  };
  rank?: 'Rookie' | 'Veteran' | 'Elite';
  imageUrl?: string;
};

export type Location = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    radius?: number;
}

const INITIAL_MOCK_LOCATIONS: Location[] = [
    { id: '1', name: 'Downtown SF Office', latitude: 37.7749, longitude: -122.4194, radius: 30 },
    { id: '2', name: 'LA Pier', latitude: 33.7413, longitude: -118.2931, radius: 30 },
];

const INITIAL_MOCK_USERS: User[] = [
  { 
    id: '1', 
    name: 'Admin User', 
    email: 'admin@example.com', 
    password: 'password', 
    role: 'admin' 
  },
  { 
    id: '2', 
    name: 'Guard One', 
    email: 'guard@example.com', 
    password: 'password', 
    role: 'guard',
    locationId: '1',
    shift: { start: '08:00', end: '16:00' },
    rank: 'Veteran',
    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  { 
    id: '3', 
    name: 'Guard Two', 
    email: 'guard2@example.com', 
    password: 'password', 
    role: 'guard',
    locationId: '2',
    shift: { start: '16:00', end: '00:00' },
    rank: 'Rookie',
    imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
];


const initializeLocalStorage = (key: string, initialData: any[]) => {
    if (typeof window !== 'undefined' && !localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(initialData));
    }
};

initializeLocalStorage('MOCK_USERS', INITIAL_MOCK_USERS);
initializeLocalStorage('MOCK_LOCATIONS', INITIAL_MOCK_LOCATIONS);


export const getMockUsers = (): User[] => {
    if (typeof window === 'undefined') return INITIAL_MOCK_USERS;
    const users = localStorage.getItem('MOCK_USERS');
    return users ? JSON.parse(users) : INITIAL_MOCK_USERS;
}

export const saveMockUsers = (users: User[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('MOCK_USERS', JSON.stringify(users));
    }
}

export const getMockLocations = (): Location[] => {
    if (typeof window === 'undefined') return INITIAL_MOCK_LOCATIONS;
    const locations = localStorage.getItem('MOCK_LOCATIONS');
    return locations ? JSON.parse(locations) : INITIAL_MOCK_LOCATIONS;
}

export const saveMockLocations = (locations: Location[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('MOCK_LOCATIONS', JSON.stringify(locations));
    }
}
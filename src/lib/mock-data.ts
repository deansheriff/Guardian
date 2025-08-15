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

export type Activity = {
  id: string;
  guardId: string;
  guard: string;
  type: 'Clock In' | 'Clock Out' | 'Check-in';
  timestamp: string;
  status: 'Success' | 'Failed';
  location?: string;
};

export type GuardActivity = {
  id: string;
  guardId: string;
  type: 'Clock In' | 'Clock Out' | 'Check-in';
  timestamp: string;
  status: 'Success' | 'Failed';
};

export const getMockUsers = (): User[] => {
    if (typeof window === 'undefined') return [];
    const users = localStorage.getItem('MOCK_USERS');
    return users ? JSON.parse(users) : [];
}

export const saveMockUsers = (users: User[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('MOCK_USERS', JSON.stringify(users));
    }
}

export const getMockLocations = (): Location[] => {
    if (typeof window === 'undefined') return [];
    const locations = localStorage.getItem('MOCK_LOCATIONS');
    return locations ? JSON.parse(locations) : [];
}

export const saveMockLocations = (locations: Location[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('MOCK_LOCATIONS', JSON.stringify(locations));
    }
}

export const getMockActivities = (): Activity[] => {
    if (typeof window === 'undefined') return [];
    const activities = localStorage.getItem('MOCK_ACTIVITIES');
    return activities ? JSON.parse(activities) : [];
}

export const saveMockActivities = (activities: Activity[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('MOCK_ACTIVITIES', JSON.stringify(activities));
    }
}
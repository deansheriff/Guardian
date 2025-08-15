export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'guard';
  location_id?: string;
  shift?: {
    start: string;
    end: string;
  };
  rank?: 'Rookie' | 'Veteran' | 'Elite';
  image_url?: string;
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
  guardid: string;
  guard: string;
  type: 'Clock In' | 'Clock Out' | 'Check-in';
  timestamp: string;
  status: 'Success' | 'Failed';
  location?: string;
};

export type Incident = {
    id: string;
    timestamp: string;
    guardName: string;
    location: string;
    description: string;
    status: 'Open' | 'Closed';
    severity?: 'low' | 'medium' | 'high';
};

export type Shift = {
    id: string;
    guardid: string;
    day: string;
    startTime: string;
    endTime: string;
    location_id: string;
};

export type PanicAlert = {
    id: string;
    timestamp: string;
    guardName: string;
    location: string;
};
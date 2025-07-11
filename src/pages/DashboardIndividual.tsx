import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, User, Edit, Plus, Trash2, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Debounce utility function
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Emergency contact interface
interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

// Sample emergency contacts data
const defaultEmergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Emergency Contact',
    relationship: 'Primary',
    phone: '+918660825177',
    email: 'praveen.hebbal2004@gmail.com',
    isPrimary: true
  }
];

const fetchLatestStatus = async () => {
  try {
    console.log('Fetching latest status...');
    const res = await fetch('/api/sensors/analysis/latest');
    console.log('Response status:', res.status);
    const data = await res.json();
    console.log('Latest status data:', data);
    return data.latestStatus;
  } catch (err) {
    console.error('Error fetching latest status:', err);
    return null;
  }
};

// Haversine formula to calculate distance between two lat/lon points
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const toRad = (x: number) => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // in meters
}

// Red marker icon (you can use a CDN or local asset)
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DashboardIndividual = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState<any>(null);
  const [prevStatus, setPrevStatus] = useState<any>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(defaultEmergencyContacts);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingNotifications, setPendingNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [backendStatus, setBackendStatus] = useState('unknown');

  useEffect(() => {
    // Don't start interval if any dialog is open
    if (isEditDialogOpen || isAddDialogOpen) {
      return;
    }

    let interval = setInterval(async () => {
      // Only update if no dialogs are open
      if (!isEditDialogOpen && !isAddDialogOpen) {
      setCurrentTime(new Date());
      const latest = await fetchLatestStatus();
      setPrevStatus(status); // store previous status for velocity calculation
      if (latest) setStatus(latest);
      }
    }, 10000); // Increased to 10 seconds to reduce refresh frequency even more
    return () => clearInterval(interval);
  }, [status, isEditDialogOpen, isAddDialogOpen]);

  // Load emergency contacts on component mount
  useEffect(() => {
    loadEmergencyContacts();
  }, []);

  // Load pending notifications periodically
  useEffect(() => {
    loadPendingNotifications();
    const interval = setInterval(loadPendingNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // Check backend status
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('/api/');
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch (error) {
        console.error('Backend connection failed:', error);
        setBackendStatus('disconnected');
      }
    };
    
    checkBackendStatus();
  }, []);

  // Load pending notifications
  const loadPendingNotifications = async () => {
    try {
      setIsLoadingNotifications(true);
      console.log('Fetching pending notifications...');
      const response = await fetch('/api/sensors/notifications/pending');
      console.log('Notifications response status:', response.status);
      const data = await response.json();
      console.log('Pending notifications data:', data);
      setPendingNotifications(data.pendingNotifications || []);
    } catch (error) {
      console.error('Failed to load pending notifications:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // Send emergency notification
  const sendNotification = async (eventId) => {
    try {
      const response = await fetch(`/api/sensors/notifications/send/${eventId}`, {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        // Remove from pending notifications
        setPendingNotifications(prev => prev.filter(n => n.id !== eventId));
        toast({
          title: "Emergency Alert Sent",
          description: `Notification sent to ${result.result.contact.name}`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast({
        title: "Failed to Send Alert",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  // Dismiss notification
  const dismissNotification = async (eventId) => {
    try {
      const response = await fetch(`/api/sensors/notifications/dismiss/${eventId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.success) {
        setPendingNotifications(prev => prev.filter(n => n.id !== eventId));
        toast({
          title: "Alert Dismissed",
          description: "Emergency alert dismissed",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
    }
  };

  // Fallback for initial render
  const crashDetected = status?.crashAlert || false;
  const rashDriving = status?.rashAlert || false;
  const geofenceStatus = status?.geofenceAlert ? 'Outside Safe Zone' : 'Inside Safe Zone';
  const helmetAlert = status?.helmetAlert || false;

  // Calculate velocity if possible
  let velocity = 0;
  if (
    status && prevStatus &&
    status.LAT !== 0 && status.LON !== 0 &&
    prevStatus.LAT !== 0 && prevStatus.LON !== 0 &&
    status.lastUpdate && prevStatus.lastUpdate &&
    status.lastUpdate !== prevStatus.lastUpdate
  ) {
    const distance = haversine(prevStatus.LAT, prevStatus.LON, status.LAT, status.LON); // meters
    const timeDiff = (status.lastUpdate - prevStatus.lastUpdate) / 1000; // seconds
    if (timeDiff > 0) {
      velocity = distance / timeDiff; // meters per second
    }
  }

  // Determine vehicle stability using acceleration magnitude
  const STABILITY_THRESHOLD = 20000; // Adjust as needed
  const ax = status?.AX ?? 0;
  const ay = status?.AY ?? 0;
  const az = status?.AZ ?? 0;
  const accelMagnitude = Math.sqrt(ax * ax + ay * ay + az * az);
  const isStable = accelMagnitude < STABILITY_THRESHOLD;

  // Emergency contact management functions
  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setIsEditDialogOpen(true);
    setIsDialogOpen(true);
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setIsAddDialogOpen(true);
    setIsDialogOpen(true);
  };

  const handleSaveContact = async (contactData: Omit<EmergencyContact, 'id'>) => {
    if (editingContact) {
      // Update existing contact
      const updatedContact = { ...contactData, id: editingContact.id };
      const updatedContacts = emergencyContacts.map(contact => 
        contact.id === editingContact.id 
          ? updatedContact
          : contact
      );
      setEmergencyContacts(updatedContacts);
      
      // Sync with backend
      try {
        const response = await fetch('/api/sensors/emergency-contact', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedContact)
        });
        
        if (response.ok) {
          toast({
            title: "Contact Updated",
            description: "Emergency contact updated successfully",
            variant: "default"
          });
        } else {
          toast({
            title: "Update Failed",
            description: "Failed to update emergency contact",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Failed to sync contact with backend:', error);
        toast({
          title: "Sync Failed",
          description: "Contact updated locally but failed to sync with backend",
          variant: "destructive"
        });
      }
      
      setIsEditDialogOpen(false);
      setIsDialogOpen(false);
    } else {
      // Add new contact
      const newContact: EmergencyContact = {
        ...contactData,
        id: Date.now().toString()
      };
      const updatedContacts = [...emergencyContacts, newContact];
      setEmergencyContacts(updatedContacts);
      saveEmergencyContacts(updatedContacts);
      setIsAddDialogOpen(false);
      setIsDialogOpen(false);
    }
    setEditingContact(null);
  };

  const handleDeleteContact = (contactId: string) => {
    const updatedContacts = emergencyContacts.filter(contact => contact.id !== contactId);
    setEmergencyContacts(updatedContacts);
    saveEmergencyContacts(updatedContacts);
  };

  const handleSetPrimary = (contactId: string) => {
    const updatedContacts = emergencyContacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === contactId
    }));
    setEmergencyContacts(updatedContacts);
    saveEmergencyContacts(updatedContacts);
  };

  // Load emergency contacts from JSON file
  const loadEmergencyContacts = async () => {
    try {
      setIsLoadingContacts(true);
      const response = await fetch('/src/data/emergencyContacts.json');
      const data = await response.json();
      setEmergencyContacts(data.emergencyContacts);
    } catch (error) {
      console.error('Failed to load emergency contacts:', error);
      // Fallback to default contacts
      setEmergencyContacts(defaultEmergencyContacts);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  // Save emergency contacts to JSON file
  const saveEmergencyContacts = async (contacts: EmergencyContact[]) => {
    try {
      // In a real application, this would be an API call to save to backend
      console.log('Saving emergency contacts:', contacts);
      // For now, we'll just update the local state
      setEmergencyContacts(contacts);
    } catch (error) {
      console.error('Failed to save emergency contacts:', error);
    }
  };

  // Emergency Contact Edit Dialog Component
  const EmergencyContactDialog = ({ 
    isOpen, 
    onClose, 
    contact, 
    onSave, 
    mode 
  }: {
    isOpen: boolean;
    onClose: () => void;
    contact: EmergencyContact | null;
    onSave: (contactData: Omit<EmergencyContact, 'id'>) => void;
    mode: 'edit' | 'add';
  }) => {
    const [formData, setFormData] = useState({
      name: contact?.name || '',
      relationship: contact?.relationship || '',
      phone: contact?.phone || '',
      email: contact?.email || '',
      isPrimary: contact?.isPrimary || false
    });

    useEffect(() => {
      if (contact) {
        setFormData({
          name: contact.name,
          relationship: contact.relationship,
          phone: contact.phone,
          email: contact.email,
          isPrimary: contact.isPrimary
        });
      } else {
        setFormData({
          name: '',
          relationship: '',
          phone: '',
          email: '',
          isPrimary: false
        });
      }
    }, [contact]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {mode === 'edit' ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'edit' 
                ? 'Update the emergency contact information below.'
                : 'Add a new emergency contact to be notified in case of emergencies.'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  value={formData.relationship}
                  onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                  placeholder="e.g., Spouse, Parent"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contact@email.com"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPrimary"
                checked={formData.isPrimary}
                onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isPrimary">Set as primary contact</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === 'edit' ? 'Update Contact' : 'Add Contact'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const isValidLocation = status && typeof status.LAT === 'number' && typeof status.LON === 'number' && status.LAT !== 0 && status.LON !== 0;
  const mapCenter: [number, number] = isValidLocation ? [status.LAT, status.LON] : [20, 0];
  const mapZoom = isValidLocation ? 15 : 2;

  return (
    <div className="min-h-screen bg-background">
      {/* Alert Popup Notification */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
        {crashDetected ? (
          <div className="rounded-lg shadow-lg px-6 py-4 flex items-center space-x-3 animate-fade-in bg-red-600/90 border border-red-400">
            <div className="w-3 h-3 rounded-full pulse-live bg-red-200" />
            <div>
              <p className="font-semibold text-lg text-white">Crash Detected!</p>
              <p className="text-sm text-white/80">
                A crash has been detected. Emergency protocols may be triggered.
              </p>
            </div>
          </div>
        ) : helmetAlert ? (
          <div className="rounded-lg shadow-lg px-6 py-4 flex items-center space-x-3 animate-fade-in bg-pink-600/90 border border-pink-400">
            <div className="w-3 h-3 rounded-full pulse-live bg-pink-200" />
            <div>
              <p className="font-semibold text-lg text-white">Helmet Not Worn!</p>
              <p className="text-sm text-white/80">
                Please wear your helmet for your safety. Riding without a helmet is unsafe and will trigger a warning.
              </p>
            </div>
          </div>
        ) : rashDriving ? (
          <div className="rounded-lg shadow-lg px-6 py-4 flex items-center space-x-3 animate-fade-in bg-yellow-500/90 border border-yellow-400">
            <div className="w-3 h-3 rounded-full pulse-live bg-yellow-200" />
            <div>
              <p className="font-semibold text-lg text-black">Rash Driving Detected!</p>
              <p className="text-sm text-white/80">
                Rash driving behavior detected. Please drive safely!
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg shadow-lg px-6 py-4 flex items-center space-x-3 bg-green-600/90 border border-green-400 animate-fade-in">
            <div className="w-3 h-3 bg-green-200 rounded-full pulse-live" />
            <div>
              <p className="font-semibold text-lg text-white">All Systems Normal</p>
              <p className="text-sm text-white/80">
                No emergency alerts detected. Ride safely!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pending Emergency Notifications */}
      {pendingNotifications.length > 0 && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-red-500 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Emergency Alerts Pending
              </h3>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {pendingNotifications.length}
              </span>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {pendingNotifications.map((notification) => (
                <div key={notification.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          notification.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                          notification.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {notification.severity}
                        </span>
                        <span className="text-sm font-medium">{notification.type}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        Time: {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        size="sm"
                        onClick={() => sendNotification(notification.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => dismissNotification(notification.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              Click ✓ to send emergency notification to primary contact
              <br />
              Click ✗ to dismiss this alert
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Smart Rider
            </h1>
            <Badge variant="outline" className="pulse-live">
              Live Monitoring
            </Badge>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/alerts')}>
              Alerts
            </Button>
            <Button variant="outline" onClick={() => navigate('/manual-trigger')}>
              Manual Trigger
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-8 fade-in flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Rider Dashboard</h2>
            <p className="text-muted-foreground">
              Last updated: {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                const latest = await fetchLatestStatus();
                if (latest) setStatus(latest);
                setCurrentTime(new Date());
              }}
            >
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                // Test emergency notification by sending crash data
                const testData = {
                  deviceId: 'ARDUINO1',
                  ALC: 800, // High alcohol
                  HEART: 120, // High heart rate
                  HELMET: 0, // No helmet
                  AX: 20000, // High acceleration (crash)
                  AY: 20000,
                  AZ: 20000,
                  LAT: 12.9716,
                  LON: 77.5946
                };
                
                try {
                  const response = await fetch('/api/sensors/', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(testData)
                  });
                  const result = await response.json();
                  console.log('Test data sent:', result);
                  toast({
                    title: "Test Data Sent",
                    description: "Emergency alerts should appear shortly",
                    variant: "default"
                  });
                } catch (error) {
                  console.error('Failed to send test data:', error);
                }
              }}
            >
              Test Alert
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                try {
                  // Send BUZZER:ON command
                  const response = await fetch('/api/sensors/buzzer', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ command: 'BUZZER:ON' })
                  });
                  
                  if (response.ok) {
                    toast({
                      title: "Buzzer Test Started",
                      description: "Buzzer will turn off in 2 seconds",
                      variant: "default"
                    });
                    
                    // Turn off buzzer after 2 seconds
                    setTimeout(async () => {
                      try {
                        await fetch('/api/sensors/buzzer', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ command: 'BUZZER:OFF' })
                        });
                        console.log('Buzzer turned off');
                      } catch (error) {
                        console.error('Failed to turn off buzzer:', error);
                      }
                    }, 2000);
                  }
                } catch (error) {
                  console.error('Failed to test buzzer:', error);
                  toast({
                    title: "Buzzer Test Failed",
                    description: "Check serial connection",
                    variant: "destructive"
                  });
                }
              }}
            >
              Test Buzzer
            </Button>
            <Badge 
              variant="outline" 
              className={`pulse-live ${
                backendStatus === 'connected' ? 'bg-green-500 text-white' :
                backendStatus === 'disconnected' ? 'bg-red-500 text-white' :
                'bg-yellow-500 text-white'
              }`}
            >
              {backendStatus === 'connected' ? 'LIVE' : 
               backendStatus === 'disconnected' ? 'OFFLINE' : 'CONNECTING'}
            </Badge>
          </div>
        </div>

        {/* Vital Signs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Heart Rate */}
          <Card className="sensor-card fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Heart Rate
                <Badge className={status?.heartAlert ? 'status-danger' : 'status-safe'}>
                  {status?.heartAlert ? 'Abnormal' : 'Normal'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold pulse-live">
                {status ? status.HEART : '--'} <span className="text-lg text-muted-foreground">bpm</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Indicates your current heart rate. Abnormal values may signal a health issue and trigger an alert to your emergency contacts.
              </div>
            </CardContent>
          </Card>

          {/* Alcohol Level */}
          <Card className="sensor-card fade-in-delay">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Alcohol Level
                <Badge className={status?.alcoholAlert ? 'status-danger' : 'status-safe'}>
                  {status?.alcoholAlert ? 'High' : 'Safe'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {status ? status.ALC : '--'} <span className="text-lg text-muted-foreground">(analog)</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Shows the alcohol level detected by the sensor. High values may indicate intoxication and can trigger safety alerts or vehicle lockout.
              </div>
            </CardContent>
          </Card>

          {/* Gyroscope */}
          <Card className="sensor-card fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Vehicle Stability
                <Badge className={isStable ? 'status-safe' : 'status-danger'}>
                  {isStable ? 'Stable' : 'Unstable'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isStable ? 'Stable' : 'Unstable'}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {isStable ? 'No unusual movements detected' : 'Unusual movement detected! Please check vehicle stability.'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Accel Magnitude: {accelMagnitude.toFixed(0)} (Threshold: {STABILITY_THRESHOLD})
              </div>
            </CardContent>
          </Card>

          {/* Helmet Status */}
          <Card className="sensor-card fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Helmet Status
                <Badge className={status?.helmetAlert ? 'status-danger' : 'status-safe'}>
                  {status?.helmetAlert ? 'Not Worn' : 'On'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {status ? (status.HELMET ? '✓' : '✗') : '--'}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Indicates if the helmet is being worn. Riding without a helmet is unsafe and will trigger a warning.
              </div>
            </CardContent>
          </Card>

          {/* Crash Detection */}
          <Card className="sensor-card fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Crash Detection
                <Badge className={crashDetected ? 'status-danger' : 'status-safe'}>
                  {crashDetected ? 'Crash Detected' : 'Normal'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {crashDetected ? '⚠️' : '✔️'}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Detects sudden impacts or falls. If a crash is detected, emergency contacts may be notified immediately.
              </div>
            </CardContent>
          </Card>

          {/* Rash Driving */}
          <Card className="sensor-card fade-in-delay">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Rash Driving
                <Badge className={rashDriving ? 'status-warning' : 'status-safe'}>
                  {rashDriving ? 'Rash Detected' : 'Normal'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {rashDriving ? '🚩' : '✔️'}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Monitors for unsafe or aggressive driving patterns. Rash driving can increase accident risk and will trigger a warning.
              </div>
            </CardContent>
          </Card>

          {/* Geofencing */}
          <Card className="sensor-card fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Geofencing
                <Badge className={geofenceStatus === 'Inside Safe Zone' ? 'status-safe' : 'status-danger'}>
                  {geofenceStatus}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {geofenceStatus === 'Inside Safe Zone' ? '🟢' : '🔴'}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Shows if the vehicle is within the allowed area. Leaving the safe zone can trigger alerts for unauthorized movement.
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Status */}
          <Card className="sensor-card fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-semibold mb-4">Vehicle Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 text-lg">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Current Speed</span>
                  <span className="font-bold text-white">{velocity && velocity > 0 ? (velocity * 3.6).toFixed(2) : 0} <span className="text-slate-400 font-normal">km/h</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Battery Level</span>
                  <span className="font-bold text-white">{status && status.batteryLevel !== undefined ? status.batteryLevel : 'N/A'} <span className="text-slate-400 font-normal">%</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Temperature</span>
                  <span className="font-bold text-white">{status && status.temperature !== undefined ? status.temperature : 'N/A'} <span className="text-slate-400 font-normal">°C</span></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Location Map - now spans 2 columns on large screens */}
          <Card className="sensor-card fade-in-delay lg:col-span-2">
            <CardHeader>
              <CardTitle>Current Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-lg overflow-hidden w-full" style={{ height: 300 }}>
                <MapContainer
                  center={mapCenter as [number, number]}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {isValidLocation && (
                    <Marker position={mapCenter} icon={redIcon}>
                      <Popup>
                        Current Location: [{status.LAT}, {status.LON}]
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
                {!isValidLocation && (
                  <div className="absolute top-1/2 left-1/2 text-center text-xs text-muted-foreground bg-background/80 px-4 py-2 rounded shadow" style={{transform: 'translate(-50%, -50%)'}}>
                    No location data available
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Real-time GPS tracking
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="sensor-card fade-in" key="emergency-contacts">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Emergency Contacts</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddContact}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Contact
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Emergency Services */}
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Emergency Services</div>
                    <div className="text-sm text-muted-foreground">24/7 Emergency Response</div>
                  </div>
                </div>
                <Button variant="destructive" size="sm">911</Button>
              </div>

              {/* Emergency Contacts List */}
              <div className="space-y-3">
                {isLoadingContacts ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-muted-foreground">Loading contacts...</span>
                  </div>
                ) : emergencyContacts.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No emergency contacts added yet</p>
                    <p className="text-xs">Click "Add Contact" to get started</p>
                  </div>
                ) : (
                  emergencyContacts.map((contact) => (
                    <div key={contact.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            contact.isPrimary ? 'bg-blue-500' : 'bg-gray-500'
                          }`}>
                            <User className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {contact.name}
                              {contact.isPrimary && (
                                <Badge variant="secondary" className="text-xs">Primary</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{contact.relationship}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditContact(contact)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteContact(contact.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{contact.phone}</span>
                          <Button variant="outline" size="sm" className="ml-auto">Call</Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{contact.email}</span>
                          <Button variant="outline" size="sm" className="ml-auto">Email</Button>
                        </div>
                      </div>
                      {!contact.isPrimary && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetPrimary(contact.id)}
                          className="mt-2 text-xs"
                        >
                          Set as Primary
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Roadside Assistance */}
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Roadside Assistance</div>
                    <div className="text-sm text-muted-foreground">24/7 Vehicle Support</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Call</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Emergency Contact Edit Dialog */}
      <EmergencyContactDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setIsDialogOpen(false);
        }}
        contact={editingContact}
        onSave={handleSaveContact}
        mode="edit"
      />

      {/* Emergency Contact Add Dialog */}
      <EmergencyContactDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setIsDialogOpen(false);
        }}
        contact={null}
        onSave={handleSaveContact}
        mode="add"
      />
    </div>
  );
};

export default DashboardIndividual;
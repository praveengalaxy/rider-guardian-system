import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const DashboardOrg = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock fleet data
  const vehicles = [
    {
      id: 'SRM-001',
      rider: 'Alex Johnson',
      model: 'Honda PCX 150',
      status: 'active',
      location: 'Downtown District',
      heartRate: 82,
      speed: 35,
      batteryLevel: 78,
      lastUpdate: '2 min ago',
      alerts: 0
    },
    {
      id: 'SRM-002',
      rider: 'Sarah Chen',
      model: 'Yamaha NMAX',
      status: 'warning',
      location: 'Business Park',
      heartRate: 105,
      speed: 0,
      batteryLevel: 45,
      lastUpdate: '1 min ago',
      alerts: 1
    },
    {
      id: 'SRM-003',
      rider: 'Mike Torres',
      model: 'Honda PCX 160',
      status: 'safe',
      location: 'University Area',
      heartRate: 75,
      speed: 25,
      batteryLevel: 92,
      lastUpdate: '30 sec ago',
      alerts: 0
    },
    {
      id: 'SRM-004',
      rider: 'Emma Wilson',
      model: 'Vespa Primavera',
      status: 'alert',
      location: 'Harbor District',
      heartRate: 0,
      speed: 0,
      batteryLevel: 15,
      lastUpdate: '15 min ago',
      alerts: 3
    },
    {
      id: 'SRM-005',
      rider: 'David Kumar',
      model: 'Suzuki Burgman',
      status: 'active',
      location: 'Shopping Mall',
      heartRate: 88,
      speed: 40,
      batteryLevel: 67,
      lastUpdate: '45 sec ago',
      alerts: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="status-safe">Active</Badge>;
      case 'safe':
        return <Badge className="status-safe">Safe</Badge>;
      case 'warning':
        return <Badge className="status-warning">Warning</Badge>;
      case 'alert':
        return <Badge className="status-danger">Alert</Badge>;
      default:
        return <Badge className="status-neutral">Unknown</Badge>;
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.rider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = vehicles.filter(v => v.status === 'active' || v.status === 'safe').length;
  const warningCount = vehicles.filter(v => v.status === 'warning').length;
  const alertCount = vehicles.filter(v => v.status === 'alert').length;

  // Add mock status for new features to each vehicle
  const getCrashStatus = (vehicle) => vehicle.status === 'alert'; // Example: alert means crash
  const getRashStatus = (vehicle) => vehicle.heartRate > 100; // Example: high heart rate = rash
  const getGeofenceStatus = (vehicle) => vehicle.location !== 'Downtown District' ? 'Outside Safe Zone' : 'Inside Safe Zone';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Smart Rider Fleet
            </h1>
            <Badge variant="outline" className="pulse-live">
              {vehicles.length} Vehicles
            </Badge>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/alerts')}>
              Alerts ({alertCount + warningCount})
            </Button>
            <Button variant="outline" onClick={() => navigate('/manual-trigger')}>
              Manual Trigger
            </Button>
            <Button variant="outline" onClick={() => navigate('/org/register-rider')}>
              Register New Rider
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-8 fade-in">
          <h2 className="text-3xl font-bold mb-2">Fleet Overview</h2>
          <p className="text-muted-foreground">
            Monitor all vehicles and rider safety in real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="sensor-card fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-muted-foreground">Active/Safe</span>
              </div>
              <div className="text-3xl font-bold text-green-400 mt-2">{activeCount}</div>
            </CardContent>
          </Card>

          <Card className="sensor-card fade-in-delay">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-sm text-muted-foreground">Warnings</span>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mt-2">{warningCount}</div>
            </CardContent>
          </Card>

          <Card className="sensor-card fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full pulse-live" />
                <span className="text-sm text-muted-foreground">Alerts</span>
              </div>
              <div className="text-3xl font-bold text-red-400 mt-2">{alertCount}</div>
            </CardContent>
          </Card>

          <Card className="sensor-card fade-in-delay">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-sm text-muted-foreground">Total Fleet</span>
              </div>
              <div className="text-3xl font-bold mt-2">{vehicles.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 fade-in">
          <Input
            placeholder="Search by rider name, vehicle ID, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Vehicle List */}
        <div className="space-y-4">
          {filteredVehicles.map((vehicle, index) => (
            <Card 
              key={vehicle.id} 
              className="sensor-card fade-in-delay cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => navigate(`/dashboard/org/${vehicle.id}`)}
            >
              <CardContent className="pt-6">
                <div className="grid lg:grid-cols-9 gap-4 items-center">
                  {/* Vehicle Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col">
                        <span className="font-semibold">{vehicle.rider}</span>
                        <span className="text-xs text-muted-foreground">{vehicle.model}</span>
                        <span className="text-xs text-muted-foreground">{vehicle.id}</span>
                      </div>
                    </div>
                  </div>
                  {/* Status Badges */}
                  <div className="flex flex-col items-center">
                    {getStatusBadge(vehicle.status)}
                  </div>
                  {/* Heart Rate */}
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-bold">{vehicle.heartRate || '--'}</div>
                    <div className="text-xs text-muted-foreground">Heart Rate</div>
                  </div>
                  {/* Speed */}
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-bold">{vehicle.speed} km/h</div>
                    <div className="text-xs text-muted-foreground">Speed</div>
                  </div>
                  {/* Crash Detection */}
                  <div className="flex flex-col items-center">
                    <Badge className={getCrashStatus(vehicle) ? 'status-danger' : 'status-safe'}>
                      {getCrashStatus(vehicle) ? 'Crash' : 'Normal'}
                    </Badge>
                    <div className="text-xs text-muted-foreground">Crash</div>
                  </div>
                  {/* Rash Driving */}
                  <div className="flex flex-col items-center">
                    <Badge className={getRashStatus(vehicle) ? 'status-warning' : 'status-safe'}>
                      {getRashStatus(vehicle) ? 'Rash' : 'Normal'}
                    </Badge>
                    <div className="text-xs text-muted-foreground">Rash</div>
                  </div>
                  {/* Geofencing */}
                  <div className="flex flex-col items-center">
                    <Badge className={getGeofenceStatus(vehicle) === 'Inside Safe Zone' ? 'status-safe' : 'status-danger'}>
                      {getGeofenceStatus(vehicle)}
                    </Badge>
                    <div className="text-xs text-muted-foreground">Geofence</div>
                  </div>
                  {/* Alerts */}
                  <div className="flex flex-col items-center">
                    {vehicle.alerts > 0 && (
                      <Badge variant="destructive">{vehicle.alerts} Alert{vehicle.alerts > 1 ? 's' : ''}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No vehicles found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardOrg;
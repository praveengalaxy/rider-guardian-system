import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const DeviceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock device data based on ID
  const deviceData = {
    'SRM-001': {
      rider: 'Alex Johnson',
      model: 'Honda PCX 150',
      status: 'active',
      location: 'Downtown District',
      heartRate: 82,
      alcoholLevel: 0.01,
      speed: 35,
      batteryLevel: 78,
      helmetStatus: true,
      gyroscopeStatus: 'Stable',
      temperature: 24
    },
    'SRM-002': {
      rider: 'Sarah Chen',
      model: 'Yamaha NMAX',
      status: 'warning',
      location: 'Business Park',
      heartRate: 105,
      alcoholLevel: 0.03,
      speed: 0,
      batteryLevel: 45,
      helmetStatus: true,
      gyroscopeStatus: 'Elevated',
      temperature: 28
    },
    'SRM-004': {
      rider: 'Emma Wilson',
      model: 'Vespa Primavera',
      status: 'alert',
      location: 'Harbor District',
      heartRate: 0,
      alcoholLevel: 0.00,
      speed: 0,
      batteryLevel: 15,
      helmetStatus: false,
      gyroscopeStatus: 'No Signal',
      temperature: 0
    }
  };

  const device = deviceData[id as keyof typeof deviceData] || deviceData['SRM-001'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getHeartRateStatus = (rate: number) => {
    if (rate === 0) return { status: 'No Signal', color: 'status-danger' };
    if (rate < 60) return { status: 'Low', color: 'status-warning' };
    if (rate > 100) return { status: 'High', color: 'status-danger' };
    return { status: 'Normal', color: 'status-safe' };
  };

  const getAlcoholStatus = (level: number) => {
    if (level > 0.05) return { status: 'High Risk', color: 'status-danger' };
    if (level > 0.02) return { status: 'Caution', color: 'status-warning' };
    return { status: 'Safe', color: 'status-safe' };
  };

  const getOverallStatus = () => {
    if (device.status === 'alert') return { status: 'Emergency Alert', color: 'status-danger' };
    if (device.status === 'warning') return { status: 'Warning', color: 'status-warning' };
    return { status: 'Normal Operation', color: 'status-safe' };
  };

  const hrStatus = getHeartRateStatus(device.heartRate);
  const alcoholStatus = getAlcoholStatus(device.alcoholLevel);
  const overallStatus = getOverallStatus();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard/org')}>
              ← Back to Fleet
            </Button>
            <h1 className="text-2xl font-bold">
              Device {id}
            </h1>
            <Badge className={overallStatus.color}>
              {overallStatus.status}
            </Badge>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/alerts')}>
              View Alerts
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/org')}>
              Fleet Dashboard
            </Button>
          </nav>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-8 fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{device.rider}</h2>
              <p className="text-muted-foreground">
                {device.model} • {device.location}
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: {currentTime.toLocaleTimeString()}
              </p>
            </div>
            {device.status === 'alert' && (
              <Button variant="destructive" size="lg">
                Emergency Response
              </Button>
            )}
          </div>
        </div>

        {/* Emergency Alert Banner */}
        {device.status === 'alert' && (
          <Card className="mb-8 border-red-500/50 bg-red-500/10 fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full pulse-live" />
                <div>
                  <p className="font-bold text-red-400 text-lg">EMERGENCY ALERT</p>
                  <p className="text-sm text-muted-foreground">
                    Device stopped responding 15 minutes ago. Last known location: {device.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vital Signs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Heart Rate */}
          <Card className="sensor-card fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Heart Rate
                <Badge className={hrStatus.color}>{hrStatus.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {device.heartRate || '--'} 
                <span className="text-lg text-muted-foreground ml-1">
                  {device.heartRate ? 'bpm' : ''}
                </span>
              </div>
              {device.heartRate > 0 && (
                <Progress value={(device.heartRate / 120) * 100} className="mt-3" />
              )}
            </CardContent>
          </Card>

          {/* Alcohol Level */}
          <Card className="sensor-card fade-in-delay">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Alcohol Level
                <Badge className={alcoholStatus.color}>{alcoholStatus.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {device.alcoholLevel.toFixed(3)} <span className="text-lg text-muted-foreground">%</span>
              </div>
              <Progress value={(device.alcoholLevel / 0.08) * 100} className="mt-3" />
            </CardContent>
          </Card>

          {/* Gyroscope */}
          <Card className="sensor-card fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Vehicle Stability
                <Badge className={device.gyroscopeStatus === 'Stable' ? 'status-safe' : 
                                 device.gyroscopeStatus === 'No Signal' ? 'status-danger' : 'status-warning'}>
                  {device.gyroscopeStatus}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {device.gyroscopeStatus}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {device.gyroscopeStatus === 'No Signal' ? 'Connection lost' : 
                 device.gyroscopeStatus === 'Stable' ? 'Normal operation' : 'Monitoring required'}
              </div>
            </CardContent>
          </Card>

          {/* Helmet Status */}
          <Card className="sensor-card fade-in-delay">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Helmet Status
                <Badge className={device.helmetStatus ? 'status-safe' : 'status-danger'}>
                  {device.helmetStatus ? 'On' : 'Off'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {device.helmetStatus ? '✓' : '✗'}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {device.helmetStatus ? 'Properly secured' : 'Safety violation'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Details Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Vehicle Metrics */}
          <Card className="sensor-card fade-in">
            <CardHeader>
              <CardTitle>Vehicle Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Speed</span>
                <span className="font-bold">{device.speed} km/h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Battery Level</span>
                <span className="font-bold">{device.batteryLevel}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Temperature</span>
                <span className="font-bold">{device.temperature}°C</span>
              </div>
              <Progress value={device.batteryLevel} className="mt-3" />
            </CardContent>
          </Card>

          {/* Location & Route */}
          <Card className="sensor-card fade-in-delay">
            <CardHeader>
              <CardTitle>Location & Route</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-32 flex items-center justify-center text-muted-foreground mb-4">
                📍 {device.location}
                <br />
                <span className="text-xs">Real-time GPS tracking</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Position</span>
                  <span>{device.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trip Duration</span>
                  <span>1h 23m</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions & Controls */}
          <Card className="sensor-card fade-in">
            <CardHeader>
              <CardTitle>Emergency Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="destructive" className="w-full">
                Emergency Alert
              </Button>
              <Button variant="outline" className="w-full">
                Contact Rider
              </Button>
              <Button variant="outline" className="w-full">
                Send Message
              </Button>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Emergency Contact: {device.rider}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Last 24 hours of device data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Device connected</span>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Trip started</span>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              {device.status === 'alert' && (
                <div className="flex items-center justify-between py-2 text-red-400">
                  <span className="text-sm">⚠️ Signal lost</span>
                  <span className="text-xs">15 minutes ago</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Helmet status: ON</span>
                <span className="text-xs text-muted-foreground">3 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeviceDetail;
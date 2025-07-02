import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const DashboardIndividual = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulate real-time data updates
  const [sensorData, setSensorData] = useState({
    heartRate: 78,
    alcoholLevel: 0.02,
    gyroscopeStatus: 'Stable',
    helmetStatus: true,
    batteryLevel: 85,
    speed: 45,
    temperature: 23
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate sensor data fluctuations
      setSensorData(prev => ({
        ...prev,
        heartRate: Math.max(60, Math.min(120, prev.heartRate + (Math.random() - 0.5) * 4)),
        alcoholLevel: Math.max(0, Math.min(0.08, prev.alcoholLevel + (Math.random() - 0.5) * 0.01)),
        speed: Math.max(0, Math.min(80, prev.speed + (Math.random() - 0.5) * 10)),
        batteryLevel: Math.max(10, prev.batteryLevel - 0.1)
      }));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const getHeartRateStatus = (rate: number) => {
    if (rate < 60) return { status: 'Low', color: 'status-warning' };
    if (rate > 100) return { status: 'High', color: 'status-danger' };
    return { status: 'Normal', color: 'status-safe' };
  };

  const getAlcoholStatus = (level: number) => {
    if (level > 0.05) return { status: 'High Risk', color: 'status-danger' };
    if (level > 0.02) return { status: 'Caution', color: 'status-warning' };
    return { status: 'Safe', color: 'status-safe' };
  };

  const hrStatus = getHeartRateStatus(sensorData.heartRate);
  const alcoholStatus = getAlcoholStatus(sensorData.alcoholLevel);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
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
            <Button variant="outline" onClick={() => navigate('/')}>
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-8 fade-in">
          <h2 className="text-3xl font-bold mb-2">Rider Dashboard</h2>
          <p className="text-muted-foreground">
            Last updated: {currentTime.toLocaleTimeString()}
          </p>
        </div>

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
              <div className="text-3xl font-bold pulse-live">
                {Math.round(sensorData.heartRate)} <span className="text-lg text-muted-foreground">bpm</span>
              </div>
              <Progress value={(sensorData.heartRate / 120) * 100} className="mt-3" />
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
                {sensorData.alcoholLevel.toFixed(3)} <span className="text-lg text-muted-foreground">%</span>
              </div>
              <Progress value={(sensorData.alcoholLevel / 0.08) * 100} className="mt-3" />
            </CardContent>
          </Card>

          {/* Gyroscope */}
          <Card className="sensor-card fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Vehicle Stability
                <Badge className="status-safe">Stable</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {sensorData.gyroscopeStatus}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                No unusual movements detected
              </div>
            </CardContent>
          </Card>

          {/* Helmet Status */}
          <Card className="sensor-card fade-in-delay">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Helmet Status
                <Badge className={sensorData.helmetStatus ? 'status-safe' : 'status-danger'}>
                  {sensorData.helmetStatus ? 'On' : 'Off'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {sensorData.helmetStatus ? '✓' : '✗'}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {sensorData.helmetStatus ? 'Properly secured' : 'Please wear helmet'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Speed & Battery */}
          <Card className="sensor-card fade-in">
            <CardHeader>
              <CardTitle>Vehicle Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Speed</span>
                <span className="font-bold">{Math.round(sensorData.speed)} km/h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Battery Level</span>
                <span className="font-bold">{Math.round(sensorData.batteryLevel)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Temperature</span>
                <span className="font-bold">{sensorData.temperature}°C</span>
              </div>
            </CardContent>
          </Card>

          {/* Location Map Placeholder */}
          <Card className="sensor-card fade-in-delay">
            <CardHeader>
              <CardTitle>Current Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-32 flex items-center justify-center text-muted-foreground">
                📍 Map Integration
                <br />
                <span className="text-xs">Real-time GPS tracking</span>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="sensor-card fade-in">
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Emergency Services</span>
                <Button variant="destructive" size="sm">911</Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">John Doe (ICE)</span>
                <Button variant="outline" size="sm">Call</Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Roadside Assistance</span>
                <Button variant="outline" size="sm">Call</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Status */}
        <Card className="fade-in border-green-500/20 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full pulse-live" />
              <div>
                <p className="font-medium text-green-400">All Systems Normal</p>
                <p className="text-sm text-muted-foreground">
                  No emergency alerts detected. Ride safely!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardIndividual;
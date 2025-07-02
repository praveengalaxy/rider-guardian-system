import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const CrashDetectionPage = () => {
  const navigate = useNavigate();
  const [sosActive, setSosActive] = useState(false);
  const [crashAlert, setCrashAlert] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: 'Emergency Services', phone: '911', type: 'emergency' },
    { name: 'John Doe (ICE)', phone: '555-0123', type: 'contact' },
    { name: 'Fleet Manager', phone: '555-0456', type: 'fleet' }
  ]);

  const triggerCrashDetection = () => {
    setCrashAlert(true);
    setTimeout(() => setCrashAlert(false), 10000);
  };

  const activateSOS = () => {
    setSosActive(true);
    setTimeout(() => setSosActive(false), 15000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard/org')}>
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Crash Detection & Emergency SOS</h1>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Emergency Alert Banner */}
        {crashAlert && (
          <Card className="mb-8 border-red-500/50 bg-red-500/10 fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full pulse-live" />
                <div>
                  <p className="font-bold text-red-400 text-lg">🚨 CRASH DETECTED</p>
                  <p className="text-sm text-muted-foreground">
                    Impact detected at 14:32 PM. Automatically contacting emergency services...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SOS Active Banner */}
        {sosActive && (
          <Card className="mb-8 border-yellow-500/50 bg-yellow-500/10 fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full pulse-live" />
                  <div>
                    <p className="font-bold text-yellow-400 text-lg">SOS ACTIVATED</p>
                    <p className="text-sm text-muted-foreground">Emergency contacts have been notified</p>
                  </div>
                </div>
                <Button variant="destructive" onClick={() => setSosActive(false)}>
                  Cancel SOS
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="sensor-card">
            <CardHeader>
              <CardTitle className="text-red-400">Emergency SOS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="destructive" 
                size="lg" 
                className="w-full"
                onClick={activateSOS}
                disabled={sosActive}
              >
                {sosActive ? 'SOS ACTIVE...' : '🆘 EMERGENCY SOS'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Instantly alerts emergency contacts with your GPS location
              </p>
            </CardContent>
          </Card>

          <Card className="sensor-card">
            <CardHeader>
              <CardTitle>Crash Detection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Detection Status</span>
                <Badge className="status-safe">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Sensitivity</span>
                <span>High</span>
              </div>
              <Progress value={85} className="mt-3" />
              <Button variant="outline" onClick={triggerCrashDetection} className="w-full">
                Simulate Crash Detection
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sensor Monitoring */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="sensor-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Accelerometer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.2G</div>
              <div className="text-sm text-muted-foreground">Normal movement</div>
            </CardContent>
          </Card>

          <Card className="sensor-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Gyroscope</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">±2°</div>
              <div className="text-sm text-muted-foreground">Stable</div>
            </CardContent>
          </Card>

          <Card className="sensor-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Impact Force</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.1G</div>
              <div className="text-sm text-muted-foreground">No impact</div>
            </CardContent>
          </Card>

          <Card className="sensor-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Heart Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78 BPM</div>
              <div className="text-sm text-muted-foreground">Normal</div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <Card className="sensor-card">
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                  <Badge variant={contact.type === 'emergency' ? 'destructive' : 'secondary'}>
                    {contact.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrashDetectionPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const ARNavigationPage = () => {
  const navigate = useNavigate();
  const [arActive, setArActive] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [currentRoute] = useState({
    destination: 'Downtown Office',
    distance: '2.3 km',
    eta: '8 minutes',
    nextTurn: 'Right turn in 150m'
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard/org')}>
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">AR Navigation & Smart Helmet</h1>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* AR HUD Simulation */}
        <Card className="mb-8 border-primary/50 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              🥽 AR Heads-Up Display
              <Badge className={arActive ? 'status-safe' : 'status-neutral'}>
                {arActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/50 rounded-lg p-6 min-h-[300px] relative border border-primary/30">
              {arActive ? (
                <>
                  {/* Simulated AR overlay */}
                  <div className="absolute top-4 left-4 text-green-400 font-mono">
                    SPEED: 35 km/h
                  </div>
                  <div className="absolute top-4 right-4 text-blue-400 font-mono">
                    GPS: ACTIVE
                  </div>
                  <div className="absolute bottom-4 left-4 text-yellow-400 font-mono">
                    ➡️ {currentRoute.nextTurn}
                  </div>
                  <div className="absolute bottom-4 right-4 text-white font-mono">
                    ETA: {currentRoute.eta}
                  </div>
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🛣️</div>
                      <p className="text-primary">AR Navigation Active</p>
                      <p className="text-muted-foreground text-sm">Route overlay visible in helmet</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⚫</div>
                    <p className="text-muted-foreground">AR Display Inactive</p>
                    <p className="text-muted-foreground text-sm">Activate to see navigation overlay</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-3">
              <Button 
                variant={arActive ? "destructive" : "hero"}
                onClick={() => setArActive(!arActive)}
              >
                {arActive ? 'Disable AR' : 'Activate AR HUD'}
              </Button>
              <Button variant="outline">Calibrate Display</Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="sensor-card">
            <CardHeader>
              <CardTitle>Current Route</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Destination:</span>
                <span className="font-medium">{currentRoute.destination}</span>
              </div>
              <div className="flex justify-between">
                <span>Distance:</span>
                <span className="font-medium">{currentRoute.distance}</span>
              </div>
              <div className="flex justify-between">
                <span>ETA:</span>
                <span className="font-medium">{currentRoute.eta}</span>
              </div>
              <div className="flex justify-between">
                <span>Next Turn:</span>
                <span className="font-medium text-yellow-400">{currentRoute.nextTurn}</span>
              </div>
              <Progress value={65} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="sensor-card">
            <CardHeader>
              <CardTitle>Voice Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant={voiceActive ? "destructive" : "secondary"}
                className="w-full"
                onClick={() => setVoiceActive(!voiceActive)}
              >
                {voiceActive ? '🎤 Listening...' : '🎙️ Activate Voice'}
              </Button>
              <div className="space-y-2 text-sm">
                <p><strong>Commands:</strong></p>
                <p>• "Navigate to [destination]"</p>
                <p>• "Show traffic ahead"</p>
                <p>• "Call emergency contact"</p>
                <p>• "Increase volume"</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Helmet Features */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="sensor-card">
            <CardHeader>
              <CardTitle className="text-sm">Helmet Sensors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Impact Sensor</span>
                  <Badge className="status-safe">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Proximity</span>
                  <Badge className="status-safe">Worn</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Camera</span>
                  <Badge className="status-safe">Recording</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sensor-card">
            <CardHeader>
              <CardTitle className="text-sm">Rear View Camera</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded h-20 flex items-center justify-center mb-3">
                <span className="text-muted-foreground text-sm">📹 Live Feed</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Clear visibility, no vehicles behind
              </div>
            </CardContent>
          </Card>

          <Card className="sensor-card">
            <CardHeader>
              <CardTitle className="text-sm">Environmental</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Weather</span>
                  <span>Clear ☀️</span>
                </div>
                <div className="flex justify-between">
                  <span>Visibility</span>
                  <span>Good</span>
                </div>
                <div className="flex justify-between">
                  <span>Road Conditions</span>
                  <span>Dry</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hazard Warnings */}
        <Card className="sensor-card">
          <CardHeader>
            <CardTitle>Real-time Hazard Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <div className="flex items-center space-x-3">
                  <span className="text-green-400">✅</span>
                  <div>
                    <p className="font-medium">Route Clear</p>
                    <p className="text-sm text-muted-foreground">No hazards detected ahead</p>
                  </div>
                </div>
                <Badge className="status-safe">All Clear</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400">⚠️</span>
                  <div>
                    <p className="font-medium">Sharp Curve Ahead</p>
                    <p className="text-sm text-muted-foreground">Reduce speed in 200m</p>
                  </div>
                </div>
                <Badge className="status-warning">Caution</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ARNavigationPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const MaintenancePage = () => {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState('SRM-001');
  
  const vehicles = [
    { id: 'SRM-001', name: 'Vehicle A', health: 85, nextService: '2 weeks' },
    { id: 'SRM-002', name: 'Vehicle B', health: 92, nextService: '1 month' },
    { id: 'SRM-004', name: 'Vehicle C', health: 68, nextService: '3 days' }
  ];

  const maintenanceAlerts = [
    { component: 'Brake Pads', status: 'warning', wear: 25, prediction: '500 km remaining' },
    { component: 'Tire Pressure', status: 'good', wear: 85, prediction: 'Normal' },
    { component: 'Battery Health', status: 'alert', wear: 15, prediction: 'Replace soon' },
    { component: 'Engine Oil', status: 'good', wear: 70, prediction: '2000 km remaining' }
  ];

  const riskAnalytics = [
    { metric: 'Hard Braking Events', value: 12, trend: 'increasing', risk: 'medium' },
    { metric: 'Rapid Acceleration', value: 8, trend: 'stable', risk: 'low' },
    { metric: 'Speed Violations', value: 3, trend: 'decreasing', risk: 'low' },
    { metric: 'Sharp Cornering', value: 15, trend: 'increasing', risk: 'high' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard/org')}>
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Predictive Maintenance & AI Analytics</h1>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Vehicle Selector */}
        <div className="flex gap-3 mb-8">
          {vehicles.map((vehicle) => (
            <Button
              key={vehicle.id}
              variant={selectedVehicle === vehicle.id ? "hero" : "outline"}
              onClick={() => setSelectedVehicle(vehicle.id)}
            >
              {vehicle.name}
            </Button>
          ))}
        </div>

        {/* AI Predictions Alert */}
        <Card className="mb-8 border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full pulse-live" />
              <div>
                <p className="font-bold text-yellow-400 text-lg">🤖 AI Maintenance Alert</p>
                <p className="text-sm text-muted-foreground">
                  Battery replacement predicted needed within 500km based on degradation patterns
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Alerts Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {maintenanceAlerts.map((alert, index) => (
            <Card key={index} className="sensor-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  {alert.component}
                  <Badge className={
                    alert.status === 'good' ? 'status-safe' :
                    alert.status === 'warning' ? 'status-warning' : 'status-danger'
                  }>
                    {alert.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{alert.wear}%</div>
                <Progress value={alert.wear} className="mb-2" />
                <div className="text-sm text-muted-foreground">{alert.prediction}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Analytics Dashboard */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="sensor-card">
            <CardHeader>
              <CardTitle>🧠 AI Risk Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAnalytics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{metric.metric}</p>
                      <p className="text-sm text-muted-foreground">
                        {metric.value} events - {metric.trend}
                      </p>
                    </div>
                    <Badge className={
                      metric.risk === 'low' ? 'status-safe' :
                      metric.risk === 'medium' ? 'status-warning' : 'status-danger'
                    }>
                      {metric.risk} risk
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="sensor-card">
            <CardHeader>
              <CardTitle>📊 Predictive Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <p className="font-medium text-blue-400">Optimal Service Window</p>
                  <p className="text-sm text-muted-foreground">
                    Schedule maintenance in 2-3 days to minimize downtime
                  </p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                  <p className="font-medium text-green-400">Cost Savings</p>
                  <p className="text-sm text-muted-foreground">
                    Predictive maintenance could save $450 this month
                  </p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <p className="font-medium text-purple-400">Usage Pattern</p>
                  <p className="text-sm text-muted-foreground">
                    Peak usage: 9AM-5PM weekdays, lighter weekend use
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Schedule */}
        <Card className="sensor-card mb-8">
          <CardHeader>
            <CardTitle>🗓️ Smart Service Scheduling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                <h4 className="font-medium text-red-400 mb-2">Urgent (3 days)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Battery replacement</li>
                  <li>• Brake pad inspection</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                <h4 className="font-medium text-yellow-400 mb-2">Scheduled (2 weeks)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Oil change</li>
                  <li>• Tire rotation</li>
                  <li>• Filter replacement</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <h4 className="font-medium text-blue-400 mb-2">Future (1 month)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Full inspection</li>
                  <li>• Software update</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="hero">Schedule Service</Button>
              <Button variant="outline">Export Report</Button>
            </div>
          </CardContent>
        </Card>

        {/* Fleet Health Overview */}
        <Card className="sensor-card">
          <CardHeader>
            <CardTitle>Fleet Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="text-center">
                  <div className="text-3xl font-bold mb-2">{vehicle.health}%</div>
                  <div className="text-sm font-medium mb-1">{vehicle.name}</div>
                  <Progress value={vehicle.health} className="mb-2" />
                  <div className="text-xs text-muted-foreground">
                    Next service: {vehicle.nextService}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenancePage;
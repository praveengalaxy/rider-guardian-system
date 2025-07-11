import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AlertsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  // Mock alerts data
  const alerts = [
    {
      id: 'ALT-001',
      timestamp: '2025-01-02 14:32',
      type: 'Signal Lost',
      severity: 'critical',
      deviceId: 'SRM-004',
      rider: 'Emma Wilson',
      location: 'Harbor District',
      description: 'Device stopped responding after impact detection',
      status: 'active',
      response: 'Emergency services dispatched'
    },
    {
      id: 'ALT-002',
      timestamp: '2025-01-02 13:45',
      type: 'High Heart Rate',
      severity: 'warning',
      deviceId: 'SRM-002',
      rider: 'Sarah Chen',
      location: 'Business Park',
      description: 'Heart rate exceeded 105 bpm for 5+ minutes',
      status: 'monitoring',
      response: 'Rider contacted'
    },
    {
      id: 'ALT-003',
      timestamp: '2025-01-02 12:15',
      type: 'Helmet Removed',
      severity: 'warning',
      deviceId: 'SRM-001',
      rider: 'Alex Johnson',
      location: 'Downtown District',
      description: 'Helmet sensor indicates removal while vehicle in motion',
      status: 'resolved',
      response: 'Rider notified, helmet replaced'
    },
    {
      id: 'ALT-004',
      timestamp: '2025-01-02 11:30',
      type: 'Alcohol Detection',
      severity: 'high',
      deviceId: 'SRM-003',
      rider: 'Mike Torres',
      location: 'University Area',
      description: 'Blood alcohol level detected above safe threshold (0.06%)',
      status: 'resolved',
      response: 'Vehicle immobilized, alternative transport arranged'
    },
    {
      id: 'ALT-005',
      timestamp: '2025-01-02 10:22',
      type: 'Low Battery',
      severity: 'low',
      deviceId: 'SRM-005',
      rider: 'David Kumar',
      location: 'Shopping Mall',
      description: 'Device battery level below 20%',
      status: 'resolved',
      response: 'Rider notified to charge device'
    },
    {
      id: 'ALT-006',
      timestamp: '2025-01-02 09:45',
      type: 'Accident Detection',
      severity: 'critical',
      deviceId: 'SRM-002',
      rider: 'Sarah Chen',
      location: 'Highway Exit 12',
      description: 'Sudden impact and rider unresponsive for 30 seconds',
      status: 'resolved',
      response: 'Emergency response completed, rider safe'
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="status-danger">Critical</Badge>;
      case 'high':
        return <Badge className="status-danger">High</Badge>;
      case 'warning':
        return <Badge className="status-warning">Warning</Badge>;
      case 'low':
        return <Badge className="status-safe">Low</Badge>;
      default:
        return <Badge className="status-neutral">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="status-danger pulse-live">Active</Badge>;
      case 'monitoring':
        return <Badge className="status-warning">Monitoring</Badge>;
      case 'resolved':
        return <Badge className="status-safe">Resolved</Badge>;
      default:
        return <Badge className="status-neutral">Unknown</Badge>;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.rider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const activeCount = alerts.filter(a => a.status === 'active' || a.status === 'monitoring').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Emergency Alerts
            </h1>
            {criticalCount > 0 && (
              <Badge className="status-danger pulse-live">
                {criticalCount} Critical
              </Badge>
            )}
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/')}>Home</Button>
          </nav>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-8 fade-in">
          <h2 className="text-3xl font-bold mb-2">Alert Management</h2>
          <p className="text-muted-foreground">
            Monitor and respond to all safety alerts across your fleet
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="sensor-card fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full pulse-live" />
                <span className="text-sm text-muted-foreground">Critical Active</span>
              </div>
              <div className="text-3xl font-bold text-red-400 mt-2">{criticalCount}</div>
            </CardContent>
          </Card>

          <Card className="sensor-card fade-in-delay">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-sm text-muted-foreground">Active/Monitoring</span>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mt-2">{activeCount}</div>
            </CardContent>
          </Card>

          <Card className="sensor-card fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-muted-foreground">Resolved Today</span>
              </div>
              <div className="text-3xl font-bold text-green-400 mt-2">{resolvedCount}</div>
            </CardContent>
          </Card>

          <Card className="sensor-card fade-in-delay">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-sm text-muted-foreground">Total Alerts</span>
              </div>
              <div className="text-3xl font-bold mt-2">{alerts.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 fade-in">
          <Input
            placeholder="Search alerts by rider, device, type, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alerts Table */}
        <Card className="sensor-card fade-in-delay">
          <CardHeader>
            <CardTitle>Alert History</CardTitle>
            <CardDescription>
              Comprehensive log of all safety alerts and emergency events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Rider</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow key={alert.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">
                      {alert.timestamp}
                    </TableCell>
                    <TableCell className="font-medium">
                      {alert.type}
                    </TableCell>
                    <TableCell>
                      {getSeverityBadge(alert.severity)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{alert.rider}</div>
                        <div className="text-xs text-muted-foreground">{alert.deviceId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto"
                        onClick={() => navigate(`/dashboard/org/${alert.deviceId}`)}
                      >
                        {alert.deviceId}
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm">
                      {alert.location}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(alert.status)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No alerts found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Response Guide */}
        <Card className="mt-8 fade-in border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-400">Emergency Response Procedures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Critical Alerts</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Immediately contact emergency services</li>
                  <li>• Dispatch nearest response team</li>
                  <li>• Notify emergency contacts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">High/Warning Alerts</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Contact rider directly</li>
                  <li>• Monitor situation closely</li>
                  <li>• Document response actions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Low Priority</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Send automated notification</li>
                  <li>• Schedule follow-up</li>
                  <li>• Log for maintenance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlertsPage;
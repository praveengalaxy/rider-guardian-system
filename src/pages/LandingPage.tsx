import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import heroImage from '@/assets/hero-monitoring.jpg';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Real-Time Safety Monitoring",
      description: "Track rider vitals, helmet status, and vehicle conditions in real-time with instant emergency alerts.",
      icon: "🛡️"
    },
    {
      title: "Health & Wellness Tracking",
      description: "Monitor heart rate, alcohol levels, and fatigue indicators to prevent incidents before they happen.",
      icon: "💓"
    },
    {
      title: "Fleet Management",
      description: "Comprehensive dashboard for rental companies to monitor multiple vehicles and ensure rider safety compliance.",
      icon: "🚗"
    },
    {
      title: "Emergency Response",
      description: "Automated emergency contact alerts and location tracking for rapid response during incidents.",
      icon: "🚨"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Smart Rider
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="hero" onClick={() => navigate('/register')}>
              Get Started
            </Button>
            <Button variant="outline" onClick={() => navigate('/manual-trigger')}>
              Manual Trigger
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Smart Rider
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Monitoring System
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Advanced IoT-powered safety monitoring for motorcycles and scooters. 
                Real-time health tracking, accident detection, and emergency response 
                to keep riders safe on every journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" onClick={() => navigate('/register')}>
                  Start Monitoring
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                  View Demo
                </Button>
              </div>
            </div>
            <div className="fade-in-delay">
              <img 
                src={heroImage} 
                alt="Smart Rider Monitoring Dashboard" 
                className="rounded-2xl shadow-2xl border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl font-bold mb-6">
              Complete Safety Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive monitoring system combines advanced sensors, 
              real-time analytics, and emergency response to create the ultimate 
              rider safety platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="sensor-card fade-in-delay hover:scale-105 transition-transform duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto fade-in">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Enhance Rider Safety?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of riders and fleet operators who trust Smart Rider 
              Monitoring System for comprehensive safety coverage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => navigate('/register')}>
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                View Dashboards
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2025 Smart Rider Monitoring System. Keeping riders safe through technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
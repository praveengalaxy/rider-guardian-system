import React from "react";

const simulationEvents = [
  { label: "Simulate Crash", endpoint: "/api/simulate/crash" },
  { label: "Simulate High Alcohol", endpoint: "/api/simulate/high-alcohol" },
  { label: "Simulate No Helmet", endpoint: "/api/simulate/no-helmet" },
  { label: "Simulate Abnormal Heart Rate", endpoint: "/api/simulate/abnormal-heart" },
  { label: "Simulate Rash Driving", endpoint: "/api/simulate/rash-driving" },
  { label: "Simulate Emergency Alert", endpoint: "/api/simulate/emergency-alert" },
  { label: "Simulate Buzzer On", endpoint: "/api/simulate/buzzer-on" },
  { label: "Simulate Buzzer Off", endpoint: "/api/simulate/buzzer-off" },
];

const SimulationPanel: React.FC = () => {
  const handleSimulate = async (endpoint: string) => {
    try {
      const res = await fetch(endpoint, { method: "POST" });
      if (!res.ok) throw new Error("Failed to trigger simulation");
      // Use a toast or notification here in a real app
      alert("Simulation triggered: " + endpoint);
    } catch (err) {
      alert("Error: " + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl bg-card/80 rounded-2xl shadow-xl border border-border p-8 mb-10 fade-in">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 text-center">Manual Trigger & Simulation</h1>
          <p className="text-lg text-muted-foreground mb-6 text-center">
            Use this panel to simulate system events and triggers for demonstration and testing. These actions do not require real sensor data and help showcase the platform's capabilities.
          </p>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {simulationEvents.map((event) => (
              <button
                key={event.endpoint}
                className="px-6 py-4 rounded-xl shadow-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/30"
                onClick={() => handleSimulate(event.endpoint)}
              >
                {event.label}
              </button>
            ))}
          </div>

          {/* High Velocity Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 text-center">High Velocity Action</h2>
            <p className="text-muted-foreground mb-6 text-center">
              Simulate a scenario where the vehicle velocity is high and the system triggers deacceleration for safety.
            </p>
            <div className="flex justify-center">
              <button
                className="px-8 py-4 rounded-xl shadow-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-300"
                onClick={() => handleSimulate('/api/simulate/deaccelerate')}
              >
                Simulate High Velocity (Trigger Deacceleration)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationPanel; 
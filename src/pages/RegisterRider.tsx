import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const healthOptions = [
  "None",
  "Heart Disease",
  "Diabetes",
  "Epilepsy",
  "Asthma",
  "Other"
];

const RegisterRider: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    vehicleId: "",
    emergencyContact: "",
    emergencyEmail: "",
    health: "None"
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Send to backend or handle in-memory
    setTimeout(() => {
      setSubmitting(false);
      alert("Rider registered successfully!");
      navigate("/dashboard/org");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="container max-w-lg py-12">
        <div className="bg-card/80 rounded-2xl shadow-xl border border-border p-8 fade-in">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6 text-center">Register New Rider</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">Rider Name</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="vehicleId">Vehicle ID</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                id="vehicleId"
                name="vehicleId"
                value={form.vehicleId}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="emergencyContact">Emergency Contact Number</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                type="tel"
                id="emergencyContact"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="emergencyEmail">Emergency Contact Email</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                type="email"
                id="emergencyEmail"
                name="emergencyEmail"
                value={form.emergencyEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="health">Health Issues</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                id="health"
                name="health"
                value={form.health}
                onChange={handleChange}
              >
                {healthOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Registering..." : "Register Rider"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterRider; 
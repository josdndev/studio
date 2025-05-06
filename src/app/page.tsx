import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Heart, Thermometer, Droplet } from "lucide-react";

// Mock function to get patient count - replace with actual data fetching
async function getPatientCount() {
  // Simulate API call
  return 125;
}

// Mock function to get average vital signs - replace with actual data fetching
async function getAverageVitalSigns() {
  // Simulate API call
  return {
    heartRate: 75,
    temperature: 36.9,
    oxygenSaturation: 97,
  };
}

export default async function DashboardPage() {
  const patientCount = await getPatientCount();
  const avgVitals = await getAverageVitalSigns();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientCount}</div>
            <p className="text-xs text-muted-foreground">Currently admitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgVitals.heartRate} bpm</div>
            <p className="text-xs text-muted-foreground">Across all patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgVitals.temperature}°C</div>
            <p className="text-xs text-muted-foreground">Across all patients</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. SpO2</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgVitals.oxygenSaturation}%</div>
            <p className="text-xs text-muted-foreground">Across all patients</p>
          </CardContent>
        </Card>
      </div>

       {/* Placeholder for Real-time Vital Signs Monitoring */}
       <Card className="mt-6">
          <CardHeader>
            <CardTitle>Real-Time Vital Signs (Sample)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Displaying sample data. Connect IoT devices for live updates.</p>
            {/* This section will be populated with real-time data */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Sample Patient 1 */}
              <Card className="bg-secondary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Patient A (Bed 101)</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4 text-lg">
                   <span className="flex items-center gap-1"><Heart size={16} /> 78 bpm</span>
                   <span className="flex items-center gap-1"><Thermometer size={16} /> 37.1°C</span>
                   <span className="flex items-center gap-1"><Droplet size={16} /> 96%</span>
                </CardContent>
              </Card>
               {/* Sample Patient 2 */}
               <Card className="bg-secondary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Patient B (Bed 102)</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4 text-lg">
                   <span className="flex items-center gap-1"><Heart size={16} /> 85 bpm</span>
                   <span className="flex items-center gap-1"><Thermometer size={16} /> 36.8°C</span>
                   <span className="flex items-center gap-1"><Droplet size={16} /> 98%</span>
                </CardContent>
              </Card>
               {/* Sample Patient 3 */}
               <Card className="bg-secondary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Patient C (Bed 103)</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4 text-lg">
                   <span className="flex items-center gap-1"><Heart size={16} /> 65 bpm</span>
                   <span className="flex items-center gap-1"><Thermometer size={16} /> 37.5°C</span>
                   <span className="flex items-center gap-1"><Droplet size={16} /> 95%</span>
                </CardContent>
              </Card>
            </div>
             {/* Add Charting component here later if needed */}
          </CardContent>
        </Card>
    </div>
  );
}

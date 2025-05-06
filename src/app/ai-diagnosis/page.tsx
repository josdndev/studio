'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import type { Patient } from '@/types/patient';
import { suggestDiagnoses } from '@/ai/flows/suggest-diagnoses'; // Import the Genkit flow

// Mock function for fetching patients - replace with actual Firebase call
async function getPatientList(): Promise<Pick<Patient, 'id' | 'name'>[]> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
  return [
    { id: 'p1', name: 'Juan Pérez' },
    { id: 'p2', name: 'María García' },
    { id: 'p3', name: 'Carlos López' },
  ];
}


export default function AiDiagnosisPage() {
  const [patients, setPatients] = useState<Pick<Patient, 'id' | 'name'>[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchPatientList = async () => {
      setIsLoadingPatients(true);
      try {
        const data = await getPatientList();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patient list:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load patient list.",
        });
      } finally {
        setIsLoadingPatients(false);
      }
    };
    fetchPatientList();
  }, [toast]);


 const handleAnalyze = async () => {
     if (!selectedPatientId) {
       toast({
         variant: "destructive",
         title: "Error",
         description: "Please select a patient to analyze.",
       });
       return;
     }

     setIsAnalyzing(true);
     setAnalysisResult(''); // Clear previous results

     try {
       const result = await suggestDiagnoses({ patientId: selectedPatientId });
       setAnalysisResult(result.suggestedDiagnoses);
       toast({
         title: "Analysis Complete",
         description: "AI suggestions generated.",
       });
     } catch (error) {
       console.error("Error running AI analysis:", error);
       toast({
         variant: "destructive",
         title: "AI Analysis Error",
         description: "Could not generate suggestions. Please try again.",
       });
        setAnalysisResult("Failed to generate suggestions.");
     } finally {
       setIsAnalyzing(false);
     }
   };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">AI Diagnostic Assistance</h1>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Patient Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="patient-select">Select Patient</Label>
              <Select
                value={selectedPatientId}
                onValueChange={setSelectedPatientId}
                disabled={isLoadingPatients || isAnalyzing}
              >
               <SelectTrigger id="patient-select" className="w-full md:w-[300px]">
                  <SelectValue placeholder={isLoadingPatients ? "Loading patients..." : "Select a patient"} />
                </SelectTrigger>
                <SelectContent>
                   {!isLoadingPatients && patients.length === 0 && (
                      <SelectItem value="no-patients" disabled>No patients available</SelectItem>
                   )}
                   {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} (ID: {patient.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          <Button onClick={handleAnalyze} disabled={isAnalyzing || !selectedPatientId}>
            {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
          </Button>

           {analysisResult && (
             <div className="space-y-2 pt-4">
               <Label htmlFor="analysis-result">AI Suggestions</Label>
               <Textarea
                 id="analysis-result"
                 readOnly
                 value={analysisResult}
                 className="min-h-[150px] bg-secondary/50"
                 placeholder="AI analysis results will appear here..."
               />
             </div>
           )}
            {!analysisResult && isAnalyzing && (
               <p className="text-muted-foreground pt-4">Generating suggestions, please wait...</p>
            )}
        </CardContent>
      </Card>

       <Card className="mt-4 border-blue-200 dark:border-blue-800">
            <CardHeader>
                <CardTitle className="text-lg text-blue-700 dark:text-blue-300">Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    The suggestions provided by the AI are for informational purposes only and should not be considered a definitive diagnosis. Always consult with qualified medical professionals for accurate diagnosis and treatment plans. Clinical judgment remains paramount.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}

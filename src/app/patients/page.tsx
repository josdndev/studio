'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { PatientForm } from './patient-form'; // Assuming patient-form.tsx is in the same directory
import type { Patient } from '@/types/patient'; // Define Patient type
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock functions for Firestore interactions - replace with actual Firebase calls
async function getPatients(): Promise<Patient[]> {
  // Simulate fetching data
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
   // Return sample data for now, ensure it matches the Patient type
   return [
     { id: 'p1', name: 'Juan Pérez', dobYear: 1980, idType: 'DNI', idNumber: '12345678A', medicalHistory: 'Asthma', contact: 'juan@example.com', status: 'En espera' },
     { id: 'p2', name: 'María García', dobYear: 1995, idType: 'Passport', idNumber: 'AB123456', medicalHistory: 'None', contact: 'maria@example.com', status: 'Pre-cirugía' },
   ];
}

async function addPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
  console.log("Adding patient:", patient);
  // Simulate adding data
  await new Promise(resolve => setTimeout(resolve, 300));
  return { ...patient, id: `p${Math.random().toString(36).substring(7)}` }; // Return with a mock ID
}

async function updatePatient(patient: Patient): Promise<Patient> {
  console.log("Updating patient:", patient);
  // Simulate updating data
  await new Promise(resolve => setTimeout(resolve, 300));
  return patient;
}

async function deletePatient(patientId: string): Promise<void> {
  console.log("Deleting patient:", patientId);
  // Simulate deleting data
  await new Promise(resolve => setTimeout(resolve, 300));
}


export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch patients.",
      });
    } finally {
      setIsLoading(false);
    }
  };

 const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsFormOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsFormOpen(true);
  };

  const handleDeletePatient = async (patientId: string) => {
     try {
       await deletePatient(patientId);
       setPatients(prev => prev.filter(p => p.id !== patientId));
       toast({
         title: "Success",
         description: "Patient deleted successfully.",
       });
     } catch (error) {
       console.error("Error deleting patient:", error);
       toast({
         variant: "destructive",
         title: "Error",
         description: "Failed to delete patient.",
       });
     }
   };


  const handleFormSubmit = async (patientData: Omit<Patient, 'id'> | Patient) => {
    try {
      if ('id' in patientData && patientData.id) {
        // Update existing patient
        const updated = await updatePatient(patientData as Patient);
        setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
        toast({
          title: "Success",
          description: "Patient updated successfully.",
        });
      } else {
        // Add new patient
        const newPatient = await addPatient(patientData);
        setPatients(prev => [...prev, newPatient]);
         toast({
           title: "Success",
           description: "Patient added successfully.",
         });
      }
      setIsFormOpen(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error saving patient:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save patient.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
        <Button onClick={handleAddPatient}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Patient
        </Button>
      </div>

       <PatientForm
         isOpen={isFormOpen}
         onOpenChange={setIsFormOpen}
         onSubmit={handleFormSubmit}
         initialData={selectedPatient}
       />


      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading patients...</p> // Simple loading indicator
          ) : patients.length === 0 ? (
             <p className="text-center text-muted-foreground py-4">No patients found. Add a new patient to get started.</p>
          ): (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Year of Birth</TableHead>
                  <TableHead>ID Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.dobYear}</TableCell>
                    <TableCell>{patient.idType}: {patient.idNumber}</TableCell>
                    <TableCell>{patient.status}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="ghost" size="icon" onClick={() => handleEditPatient(patient)}>
                         <Edit className="h-4 w-4" />
                         <span className="sr-only">Edit</span>
                       </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                               <Trash2 className="h-4 w-4" />
                               <span className="sr-only">Delete</span>
                             </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the patient
                                and remove their data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDeletePatient(patient.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

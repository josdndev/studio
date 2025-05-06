'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Patient } from '@/types/patient';
import { useEffect } from "react";

// Define patient status options according to the proposal
const patientStatuses = [
  "En espera",
  "Pre-cirugía",
  "En Cirugía",
  "Post-cirugía",
  "De alta",
  "Visto/Consulta Finalizada",
  "Telemedicina", // Added Telemedicina as a status or type
];

const patientIdTypes = [
  "DNI",
  "Passport",
  "Cédula",
  "Otro",
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  dobYear: z.coerce.number().int().min(1900, { message: "Invalid year." }).max(new Date().getFullYear(), { message: "Year cannot be in the future." }),
  idType: z.string().min(1, { message: "ID Type is required." }),
  idNumber: z.string().min(1, { message: "ID Number is required." }),
  medicalHistory: z.string().optional(),
  contact: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')), // Allow empty string or valid email
  status: z.string().min(1, { message: "Status is required." }),
});

type PatientFormData = z.infer<typeof formSchema>;

interface PatientFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Patient, 'id'> | Patient) => void;
  initialData?: Patient | null;
}

export function PatientForm({ isOpen, onOpenChange, onSubmit, initialData }: PatientFormProps) {
  const form = useForm<PatientFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dobYear: undefined,
      idType: "",
      idNumber: "",
      medicalHistory: "",
      contact: "",
      status: "",
    },
  });

   useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        dobYear: initialData.dobYear,
        idType: initialData.idType,
        idNumber: initialData.idNumber,
        medicalHistory: initialData.medicalHistory || "",
        contact: initialData.contact || "",
        status: initialData.status,
      });
    } else {
      form.reset({ // Reset to default when adding new
          name: "",
          dobYear: undefined,
          idType: "",
          idNumber: "",
          medicalHistory: "",
          contact: "",
          status: "",
      });
    }
  }, [initialData, form, isOpen]); // Depend on isOpen to reset form when dialog opens

  const handleFormSubmit = (values: PatientFormData) => {
     if (initialData?.id) {
       onSubmit({ ...values, id: initialData.id }); // Submit with ID if editing
     } else {
       onSubmit(values); // Submit without ID if adding
     }
     form.reset(); // Reset form after submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) form.reset(); // Reset form if dialog is closed without submitting
        onOpenChange(open);
      }}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Patient" : "Add New Patient"}</DialogTitle>
          <DialogDescription>
             {initialData ? "Update the patient's details." : "Enter the details for the new patient."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
               control={form.control}
               name="dobYear"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Year of Birth</FormLabel>
                   <FormControl>
                     <Input type="number" placeholder="YYYY" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
             <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="idType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Type</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                         <FormControl>
                           <SelectTrigger>
                             <SelectValue placeholder="Select ID type" />
                           </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                           {patientIdTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                         </SelectContent>
                       </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ID number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact (Email)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical History</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter relevant medical history" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patientStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
               <DialogClose asChild>
                 <Button type="button" variant="outline">Cancel</Button>
               </DialogClose>
              <Button type="submit">
                {initialData ? "Save Changes" : "Add Patient"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

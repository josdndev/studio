/**
 * Represents a patient in the hospital system.
 */
export type Patient = {
  patientId?: string;
  fullName: string;
  birthYear: number;
  documentType: string;
  documentNumber: string;
  medicalHistory?: string;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MedicalCenter = {
  centerId?: string;
  name: string;
  address: string;
  contact?: {
    phone?: string;
    email?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type Vital = {
  vitalId?: string;
  patientId: string;
  timestamp: Date;
  type:
    | "bpm"
    | "oxygenSaturation"
    | "temperature"
    | "bloodPressure"
    | "glucose";
  value: number;
  createdAt?: Date;
  updatedAt?: Date;
};
export interface visit {
  visitId?:string,
  patientId: string
  centerId:string
}

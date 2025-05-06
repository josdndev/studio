import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MedicalCenter, Patient, Vital } from "@/types/patient";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validatePatient = (patient: Patient): boolean => {
  if (
    !patient.fullName ||
    typeof patient.fullName !== 'string' ||
    !patient.birthYear ||
    typeof patient.birthYear !== 'number' ||
    !patient.documentType ||
    typeof patient.documentType !== 'string' ||
    !patient.documentNumber ||
    typeof patient.documentNumber !== 'string' ||
    !patient.contact ||
    typeof patient.contact !== 'object' ||
    !patient.contact.phone ||
    typeof patient.contact.phone !== 'string' ||
    !patient.contact.email ||
    typeof patient.contact.email !== 'string'
  ) {
    return false
  }

  return true
}

export const validateMedicalCenter = (medicalCenter: MedicalCenter): boolean => {
  if (
    !medicalCenter.name ||
    typeof medicalCenter.name !== 'string' ||
    !medicalCenter.address ||
    typeof medicalCenter.address !== 'string' ||
    !medicalCenter.contact ||
    typeof medicalCenter.contact !== 'object' ||
    !medicalCenter.contact.phone ||
    typeof medicalCenter.contact.phone !== 'string' ||
    !medicalCenter.contact.email ||
    typeof medicalCenter.contact.email !== 'string'
  ) {
    return false
  }
  return true
}

export const validateVital = (vital: Vital): boolean => {
  if (
    !vital.type ||
    typeof vital.type !== 'string' ||
    !vital.value ||
    typeof vital.value !== 'number' ||
    !vital.patientId
  ) {
    return false
  }
  return true
}

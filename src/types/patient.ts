/**
 * Represents a patient in the hospital system.
 */
export interface Patient {
  /**
   * Unique identifier for the patient (e.g., Firestore document ID).
   */
  id: string;
  /**
   * Patient's full name.
   */
  name: string;
  /**
   * Patient's year of birth.
   */
  dobYear: number;
  /**
   * Type of identification document (e.g., DNI, Passport).
   */
  idType: string;
  /**
   * Identification document number.
   */
  idNumber: string;
  /**
   * Relevant medical history notes. Optional.
   */
  medicalHistory?: string;
  /**
   * Patient's contact information (e.g., email or phone). Optional.
   */
  contact?: string;
   /**
    * Current status of the patient within the hospital flow.
    */
   status: string; // e.g., "En espera", "Pre-cirugía", etc.
}

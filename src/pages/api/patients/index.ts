import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebaseAdmin';

interface Patient {
  patientId?: string;
  fullName: string;
  birthYear: number;
  documentType: string;
  documentNumber: string;
  medicalHistory?: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const validatePatient = (patient: Patient): string | null => {
  if (!patient.fullName || typeof patient.fullName !== 'string') {
    return 'Invalid full name';
  }
  if (!patient.birthYear || typeof patient.birthYear !== 'number') {
    return 'Invalid birth year';
  }
  if (!patient.documentType || typeof patient.documentType !== 'string') {
    return 'Invalid document type';
  }
  if (!patient.documentNumber || typeof patient.documentNumber !== 'string') {
    return 'Invalid document number';
  }
  if (!patient.contact || typeof patient.contact !== 'object') {
    return 'Invalid contact information';
  }
  if (
    !patient.contact.phone ||
    typeof patient.contact.phone !== 'string'
  ) {
    return 'Invalid phone number';
  }
  if (
    !patient.contact.email ||
    typeof patient.contact.email !== 'string'
  ) {
    return 'Invalid email address';
  }
  if (
    !patient.contact.address ||
    typeof patient.contact.address !== 'string'
  ) {
    return 'Invalid address';
  }
  if (!patient.status || typeof patient.status !== 'string') {
    return 'Invalid status';
  }
  return null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const patientData: Patient = req.body;
      const validationError = validatePatient(patientData);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }
      const patientRef = db.collection('patients').doc();
      const newPatientId = patientRef.id;
      const newPatient: Patient = {
        ...patientData,
        patientId: newPatientId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await patientRef.set(newPatient);

      res.status(201).json({ patientId: newPatientId, ...newPatient });
    } catch (error) {
      console.error('Error creating patient:', error);
      res.status(500).json({ error: 'Failed to create patient' });
    }
  } else if (req.method === 'GET') {
    try {
      const { patientId } = req.query;

      if (patientId && typeof patientId === 'string') {
        const patientDoc = await db
          .collection('patients')
          .doc(patientId)
          .get();

        if (!patientDoc.exists) {
          return res.status(404).json({ error: 'Patient not found' });
        }

        const patient = patientDoc.data() as Patient;
        return res.status(200).json(patient);
      } else {
        const patientsSnapshot = await db.collection('patients').get();
        const patients: Patient[] = [];
        patientsSnapshot.forEach((doc) => {
          patients.push(doc.data() as Patient);
        });
        return res.status(200).json(patients);
      }
    } catch (error) {
      console.error('Error retrieving patients:', error);
      res.status(500).json({ error: 'Failed to retrieve patients' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
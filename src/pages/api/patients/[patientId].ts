import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebaseAdmin';
import { Patient, visit } from '@/types/patient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { patientId } = req.query;

  if (req.method === 'GET') {
    try {
      if (!patientId || typeof patientId !== 'string') {
        return res.status(400).json({ error: 'Invalid patient ID' });
      }

      const patientDoc = await db.collection('patients').doc(patientId).get();

      if (!patientDoc.exists) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      const patientData = patientDoc.data() as Patient;

      const visitsSnapshot = await db
        .collection('visits')
        .where('patientId', '==', patientId)
        .get();

      const visits: visit[] = [];
      visitsSnapshot.forEach((doc) => {
        visits.push({ visitId:doc.id, ...doc.data() } as visit);
      });

      const patientWithVisits = {
        ...patientData,
        visits: visits,
      };

      res.status(200).json(patientWithVisits);
    } catch (error) {
      console.error('Error retrieving patient with visits:', error);
      res.status(500).json({ error: 'Failed to retrieve patient with visits' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
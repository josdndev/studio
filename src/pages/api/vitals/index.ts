import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { patientId, type, value, timestamp } = req.body;

      // Validate data
      if (!patientId || !type || value === undefined || !timestamp) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (typeof patientId !== 'string' || typeof type !== 'string' || typeof value !== 'number' || typeof timestamp !== 'number' ) {
        return res.status(400).json({ error: 'Invalid data types' });
      }
      //Add new vital
      const newVital = {
        patientId,
        type,
        value,
        timestamp: new Date(timestamp),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const docRef = await db.collection('vitals').add(newVital);
      const newVitalDocument = await docRef.get();
      const newVitalData = newVitalDocument.data();

      res.status(201).json({ id: docRef.id, ...newVitalData });
    } catch (error) {
      console.error('Error creating vital:', error);
      res.status(500).json({ error: 'Error creating vital' });
    }
  } else if (req.method === 'GET') {
    try {
      const { patientId, from, to } = req.query;
      let vitalsQuery = db.collection('vitals');

      // Filter by patientId if provided
      if (patientId) {
        if(typeof patientId !== 'string'){
          return res.status(400).json({ error: 'Invalid data types' });
        }
        vitalsQuery = vitalsQuery.where('patientId', '==', patientId);
      }

      // Filter by time range if provided
      if (from && to) {
        const fromDate = new Date(Number(from));
        const toDate = new Date(Number(to));

         if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          return res.status(400).json({ error: 'Invalid date format' });
        }
        vitalsQuery = vitalsQuery
        .where('timestamp', '>=', fromDate)
        .where('timestamp', '<=', toDate);
      }

      const snapshot = await vitalsQuery.get();
      const vitals: FirebaseFirestore.DocumentData[] = [];

      snapshot.forEach((doc) => {
        vitals.push({ id: doc.id, ...doc.data() });
      });

      res.status(200).json(vitals);
    } catch (error) {
      console.error('Error retrieving vitals:', error);
      res.status(500).json({ error: 'Error retrieving vitals' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
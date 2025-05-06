import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebaseAdmin';
import { visit } from '@/types/patient';

const validateVisit = (visit: visit): string | null => {
  if (!visit.patientId || typeof visit.patientId !== 'string') {
    return 'Invalid patientId';
  }
  if (!visit.centerId || typeof visit.centerId !== 'string') {
    return 'Invalid centerId';
  }

  return null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const visitData: visit = req.body;
      const validationError = validateVisit(visitData);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }
      const visitRef = db.collection('visits').doc();
      const newVisitId = visitRef.id;
      const newVisit: visit = {
        ...visitData,
        visitId: newVisitId
      };

      await visitRef.set(newVisit);
      const patientRef = db.collection('patients').doc(newVisit.patientId);

      await patientRef.update({
        updatedAt: new Date(),
      });

      res.status(201).json({ visitId: newVisitId, ...newVisit });
    } catch (error) {
      console.error('Error creating visit:', error);
      res.status(500).json({ error: 'Failed to create visit' });
    }
  } else if (req.method === 'GET') {
    try {
      const { visitId } = req.query;

      if (visitId && typeof visitId === 'string') {
        const visitDoc = await db.collection('visits').doc(visitId).get();

        if (!visitDoc.exists) {
          return res.status(404).json({ error: 'Visit not found' });
        }

        const visit = {visitId:visitDoc.id,...visitDoc.data()} as visit;
        return res.status(200).json(visit);
      } else {
        const visitsSnapshot = await db.collection('visits').get();
        const visits: visit[] = [];
        visitsSnapshot.forEach((doc) => {
          visits.push({visitId:doc.id,...doc.data()} as visit);
        });
        return res.status(200).json(visits);
      }
    } catch (error) {
      console.error('Error retrieving visits:', error);
      res.status(500).json({ error: 'Failed to retrieve visits' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
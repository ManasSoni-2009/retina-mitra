import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Screening } from '@/types/screening';

export interface AuditEventRecord {
  eventId?: string;
  eventType: 'screening_created' | 'image_uploaded' | 'ai_inference_completed' | 'result_viewed' | 'reviewer_opened_case' | 'human_override' | 'report_generated';
  userId: string;
  userRole: string;
  screeningId?: string;
  timestamp: any;
  metadata?: Record<string, any>;
}

export interface ReviewNoteRecord {
  noteId?: string;
  screeningId: string;
  reviewerId: string;
  action: 'CONFIRMED' | 'OVERRIDDEN' | 'RE_REVIEW' | 'UNGRADABLE';
  overrideGrade?: number;
  comments: string;
  createdAt: any;
}

// Screenings Firestore Service
export const saveScreeningRecord = async (screening: Screening): Promise<void> => {
  const docRef = doc(db, 'screenings', screening.screeningId);
  await setDoc(docRef, {
    ...screening,
    updatedAt: serverTimestamp(),
  });
};

export const fetchScreeningById = async (screeningId: string): Promise<Screening | null> => {
  const docRef = doc(db, 'screenings', screeningId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as Screening;
  }
  return null;
};

export const fetchRecentScreenings = async (limitCount = 20): Promise<Screening[]> => {
  const q = query(collection(db, 'screenings'), orderBy('createdAt', 'desc'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Screening);
};

export const fetchReviewerQueue = async (): Promise<Screening[]> => {
  const q = query(
    collection(db, 'screenings'),
    where('requiresHumanReview', '==', true),
    where('reviewStatus', '==', 'PENDING')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Screening);
};

// Review Notes Service
export const addReviewNote = async (note: ReviewNoteRecord): Promise<string> => {
  const colRef = collection(db, 'reviewNotes');
  const res = await addDoc(colRef, {
    ...note,
    createdAt: serverTimestamp(),
  });
  return res.id;
};

// Audit Logging Service (Append Only)
export const logAuditEvent = async (event: Omit<AuditEventRecord, 'timestamp'>): Promise<void> => {
  const colRef = collection(db, 'auditEvents');
  await addDoc(colRef, {
    ...event,
    timestamp: serverTimestamp(),
  });
};

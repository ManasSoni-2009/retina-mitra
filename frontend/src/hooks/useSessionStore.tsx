'use client';

/**
 * RETINA-MITRA Session Store
 *
 * Tracks live session interactions: patient screenings, specialist reviews,
 * report generations, and audit history.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Screening, ReviewDecision } from '@/types/screening';
import { DEMO_CASES, demoCaseToScreening, getDemoCase, DemoCaseConfig } from '@/data/prototypeCases';

export interface ScreenedCase {
  caseId: string;
  screening: Screening;
  screenedAt: string;
  reportGenerated: boolean;
}

interface SessionState {
  screenedCases: ScreenedCase[];
  reportsGenerated: number;
}

interface SessionStoreContextType {
  screenedCases: ScreenedCase[];
  reportsGenerated: number;
  screenCase: (demoOrCustom: DemoCaseConfig | Screening) => Screening;
  getScreenedCase: (caseId: string) => ScreenedCase | undefined;
  markReportGenerated: (caseId: string) => void;
  submitReview: (caseId: string, review: ReviewDecision) => void;
  casesRequiringReview: ScreenedCase[];
  totalScreened: number;
}

const STORAGE_KEY = 'retina_mitra_session_v3';

// Start with empty history by default per prompt specifications
const INITIAL_SCREENED_CASES: ScreenedCase[] = [];

const SessionStoreContext = createContext<SessionStoreContextType>({
  screenedCases: INITIAL_SCREENED_CASES,
  reportsGenerated: 0,
  screenCase: () => ({} as Screening),
  getScreenedCase: () => undefined,
  markReportGenerated: () => {},
  submitReview: () => {},
  casesRequiringReview: [],
  totalScreened: 0,
});

export const SessionStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SessionState>({
    screenedCases: INITIAL_SCREENED_CASES,
    reportsGenerated: 0,
  });

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SessionState;
        if (parsed.screenedCases) {
          setState(parsed);
        }
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }
  }, []);

  // Persist to sessionStorage on change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage storage limits
    }
  }, [state]);

  const screenCase = useCallback((item: DemoCaseConfig | Screening): Screening => {
    const now = new Date().toISOString();
    const screening: Screening = 'demoNumber' in item ? demoCaseToScreening(item) : item;

    setState((prev) => {
      const existingIdx = prev.screenedCases.findIndex(
        (s) => s.caseId.toUpperCase() === screening.screeningId.toUpperCase() || 
               s.screening.screeningId.toUpperCase() === screening.screeningId.toUpperCase()
      );

      const entry: ScreenedCase = {
        caseId: screening.screeningId,
        screening,
        screenedAt: now,
        reportGenerated: false,
      };

      const updated = [...prev.screenedCases];
      if (existingIdx >= 0) {
        updated[existingIdx] = entry;
      } else {
        updated.unshift(entry);
      }

      return { ...prev, screenedCases: updated };
    });

    return screening;
  }, []);

  const getScreenedCase = useCallback(
    (caseId: string): ScreenedCase | undefined => {
      // First check session state
      const norm = caseId.trim().toUpperCase();
      const found = state.screenedCases.find(
        (s) => s.caseId.toUpperCase() === norm || s.screening.screeningId.toUpperCase() === norm
      );
      if (found) return found;

      // Fallback to prototype case library so direct URLs / links function cleanly
      const demo = getDemoCase(caseId);
      if (demo) {
        const screening = demoCaseToScreening(demo);
        return {
          caseId: screening.screeningId,
          screening,
          screenedAt: screening.createdAt,
          reportGenerated: false,
        };
      }

      return undefined;
    },
    [state.screenedCases]
  );

  const markReportGenerated = useCallback((caseId: string) => {
    const norm = caseId.trim().toUpperCase();
    setState((prev) => ({
      ...prev,
      reportsGenerated: prev.reportsGenerated + 1,
      screenedCases: prev.screenedCases.map((s) =>
        s.caseId.toUpperCase() === norm || s.screening.screeningId.toUpperCase() === norm
          ? { ...s, reportGenerated: true }
          : s
      ),
    }));
  }, []);

  const submitReview = useCallback((caseId: string, review: ReviewDecision) => {
    const norm = caseId.trim().toUpperCase();
    const now = new Date().toISOString();

    setState((prev) => {
      const target = prev.screenedCases.find(
        (s) => s.caseId.toUpperCase() === norm || s.screening.screeningId.toUpperCase() === norm
      );

      // If not yet in session, look up demo case and add it
      let baseScreening: Screening;
      if (target) {
        baseScreening = target.screening;
      } else {
        const demo = getDemoCase(caseId);
        baseScreening = demo ? demoCaseToScreening(demo) : ({} as Screening);
      }

      if (!baseScreening.screeningId) return prev;

      const updatedAudit = [
        ...(baseScreening.auditTrail || []),
        {
          id: `AUD-${Date.now()}`,
          timestamp: now,
          actorId: review.reviewerId || 'CLINICIAN',
          actorRole: 'reviewer' as const,
          action: review.action === 'OVERRIDDEN' ? ('OVERRIDDEN' as const) : ('REVIEW_COMPLETED' as const),
          details: `Specialist decision: ${review.action}. Note: ${review.comments}`,
        },
      ];

      let newDrGrade = baseScreening.drGrade;
      let newDrGradeLabel = baseScreening.drGradeLabel;
      if (review.action === 'OVERRIDDEN' && typeof review.overrideGrade === 'number') {
        const gradeLabels = ['No DR', 'Mild DR', 'Moderate DR', 'Severe DR', 'Proliferative DR'];
        newDrGrade = {
          drGrade: review.overrideGrade as 0 | 1 | 2 | 3 | 4,
          drGradeLabel: `${gradeLabels[review.overrideGrade]} (Clinician Override)`,
          referable: review.overrideGrade >= 2,
        };
        newDrGradeLabel = `${gradeLabels[review.overrideGrade]} (Clinician Override)`;
      }

      const updatedScreening: Screening = {
        ...baseScreening,
        reviewStatus:
          review.action === 'CONFIRMED'
            ? 'REVIEW_COMPLETED'
            : review.action === 'OVERRIDDEN'
            ? 'OVERRIDDEN'
            : review.action === 'UNGRADABLE'
            ? 'UNGRADABLE'
            : 'REVIEW_COMPLETED',
        reviewDecision: {
          ...review,
          reviewedAt: now,
        },
        drGrade: newDrGrade,
        drGradeLabel: newDrGradeLabel,
        requiresHumanReview: false,
        auditTrail: updatedAudit,
      };

      const existingIdx = prev.screenedCases.findIndex(
        (s) => s.caseId.toUpperCase() === norm || s.screening.screeningId.toUpperCase() === norm
      );

      const updatedCases = [...prev.screenedCases];
      const entry: ScreenedCase = {
        caseId: updatedScreening.screeningId,
        screening: updatedScreening,
        screenedAt: target ? target.screenedAt : now,
        reportGenerated: target ? target.reportGenerated : false,
      };

      if (existingIdx >= 0) {
        updatedCases[existingIdx] = entry;
      } else {
        updatedCases.unshift(entry);
      }

      return {
        ...prev,
        screenedCases: updatedCases,
      };
    });
  }, []);

  const casesRequiringReview = state.screenedCases.filter(
    (c) => c.screening.requiresHumanReview && c.screening.reviewStatus === 'REVIEW_REQUIRED'
  );

  return (
    <SessionStoreContext.Provider
      value={{
        screenedCases: state.screenedCases,
        reportsGenerated: state.reportsGenerated,
        screenCase,
        getScreenedCase,
        markReportGenerated,
        submitReview,
        casesRequiringReview,
        totalScreened: state.screenedCases.length,
      }}
    >
      {children}
    </SessionStoreContext.Provider>
  );
};

export const useSessionStore = () => useContext(SessionStoreContext);

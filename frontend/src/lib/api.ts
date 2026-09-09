import { Screening, ImageQualityDetail } from '@/types/screening';
import { SimulationInputParams, SimulationResult } from '@/types/simulation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export const api = {
  async getHealthStatus() {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('API Health check failed');
    return res.json();
  },

  async createScreening(patientAlias: string, operatorId = 'PHC-TECH-01', phcCenter = 'PHC Rampur', district = 'Nanded') {
    const res = await fetch(`${API_BASE_URL}/screenings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientAlias, operatorId, phcCenter, district }),
    });
    if (!res.ok) throw new Error('Failed to create screening record');
    return res.json();
  },

  async uploadFundusImage(screeningId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/screenings/${screeningId}/image`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Image upload failed' }));
      throw new Error(err.detail || 'Image validation failed');
    }
    return res.json();
  },

  async runAnalysis(screeningId: string) {
    const res = await fetch(`${API_BASE_URL}/screenings/${screeningId}/analyze`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Analysis pipeline execution failed');
    return res.json();
  },

  async getScreeningDetail(screeningId: string) {
    const res = await fetch(`${API_BASE_URL}/screenings/${screeningId}`);
    if (!res.ok) throw new Error('Failed to fetch screening record');
    return res.json();
  },

  async listScreenings(filters?: { quality_status?: string; dr_grade?: number; referable?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.quality_status) params.append('quality_status', filters.quality_status);
    if (filters?.dr_grade !== undefined) params.append('dr_grade', filters.dr_grade.toString());
    if (filters?.referable !== undefined) params.append('referable', filters.referable.toString());

    const res = await fetch(`${API_BASE_URL}/screenings?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch screenings list');
    return res.json();
  },

  async runSimulation(params: SimulationInputParams): Promise<SimulationResult> {
    const res = await fetch(`${API_BASE_URL}/simulation/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Simulation execution failed');
    return res.json();
  },

  async submitReview(screeningId: string, action: string, overrideGrade?: number, comments = '') {
    const res = await fetch(`${API_BASE_URL}/screenings/${screeningId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewerId: 'DR-S-RAO',
        action,
        overrideGrade,
        comments,
        reviewedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error('Failed to submit review decision');
    return res.json();
  }
};

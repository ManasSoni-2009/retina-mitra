/**
 * RETINA-MITRA Offline Sync & Resiliency Engine.
 * Manages draft queueing, exponential backoff retries, idempotency key generation,
 * and network status transitions for rural health settings.
 */

export type ConnectivityState = 'ONLINE' | 'SYNCING' | 'OFFLINE' | 'SYNC_FAILED';

export interface OfflineScreeningDraft {
  id: string;
  screeningId: string;
  idempotencyKey: string;
  patientAlias: string;
  phcCenter: string;
  district: string;
  imagePayloadUrl: string;
  sampleType: string;
  createdAt: string;
  retryAttempts: number;
  lastError?: string;
  status: 'QUEUED' | 'SYNCING' | 'SYNC_FAILED';
}

const DRAFT_STORAGE_KEY = 'drishtisetu_offline_queue';
const SIMULATED_OFFLINE_KEY = 'drishtisetu_simulated_offline';

class SyncEngine {
  private status: ConnectivityState = 'ONLINE';
  private listeners: ((status: ConnectivityState, count: number) => void)[] = [];
  private simulatedOffline: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.simulatedOffline = localStorage.getItem(SIMULATED_OFFLINE_KEY) === 'true';
      this.status = this.simulatedOffline ? 'OFFLINE' : (navigator.onLine ? 'ONLINE' : 'OFFLINE');

      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));
    }
  }

  public subscribe(listener: (status: ConnectivityState, count: number) => void) {
    this.listeners.push(listener);
    listener(this.status, this.getPendingDrafts().length);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    const count = this.getPendingDrafts().length;
    this.listeners.forEach(l => l(this.status, count));
  }

  private handleNetworkChange(isOnline: boolean) {
    if (this.simulatedOffline) {
      this.status = 'OFFLINE';
    } else {
      this.status = isOnline ? 'ONLINE' : 'OFFLINE';
      if (isOnline) {
        this.syncPendingQueue();
      }
    }
    this.notify();
  }

  public isOnline(): boolean {
    if (this.simulatedOffline) return false;
    return typeof window !== 'undefined' ? navigator.onLine : true;
  }

  public toggleSimulatedOffline(): boolean {
    this.simulatedOffline = !this.simulatedOffline;
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIMULATED_OFFLINE_KEY, String(this.simulatedOffline));
    }
    this.status = this.simulatedOffline ? 'OFFLINE' : (navigator.onLine ? 'ONLINE' : 'OFFLINE');
    this.notify();
    return this.simulatedOffline;
  }

  public isSimulatedOffline(): boolean {
    return this.simulatedOffline;
  }

  public getPendingDrafts(): OfflineScreeningDraft[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public queueOfflineDraft(patientAlias: string, sampleType: string, imageUrl: string): OfflineScreeningDraft {
    const drafts = this.getPendingDrafts();
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newScreeningId = `SCR-2026-${randomHex}`;
    const idempotencyKey = `IDEM-${Date.now()}-${randomHex}`;

    const draft: OfflineScreeningDraft = {
      id: `DRAFT-${Date.now()}`,
      screeningId: newScreeningId,
      idempotencyKey,
      patientAlias,
      phcCenter: "Primary Health Center - Rampur",
      district: "Nanded",
      imagePayloadUrl: imageUrl,
      sampleType,
      createdAt: new Date().toISOString(),
      retryAttempts: 0,
      status: 'QUEUED'
    };

    drafts.push(draft);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
    }
    this.notify();

    // Auto trigger sync if online
    if (this.isOnline()) {
      this.syncPendingQueue();
    }

    return draft;
  }

  public async syncPendingQueue() {
    if (!this.isOnline()) {
      this.status = 'OFFLINE';
      this.notify();
      return;
    }

    const drafts = this.getPendingDrafts();
    if (drafts.length === 0) {
      this.status = 'ONLINE';
      this.notify();
      return;
    }

    this.status = 'SYNCING';
    this.notify();

    let remainingDrafts: OfflineScreeningDraft[] = [];

    for (const draft of drafts) {
      const success = await this.uploadDraftWithExponentialBackoff(draft);
      if (!success) {
        draft.status = 'SYNC_FAILED';
        draft.retryAttempts += 1;
        remainingDrafts.push(draft);
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(remainingDrafts));
    }

    this.status = remainingDrafts.length > 0 ? 'SYNC_FAILED' : 'ONLINE';
    this.notify();
  }

  private async uploadDraftWithExponentialBackoff(draft: OfflineScreeningDraft): Promise<boolean> {
    const maxRetries = 4;
    let attempt = draft.retryAttempts;

    while (attempt < maxRetries) {
      try {
        const createRes = await fetch('http://localhost:8000/api/v1/screenings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Idempotency-Key': draft.idempotencyKey
          },
          body: JSON.stringify({
            patientAlias: draft.patientAlias,
            operatorId: "PHC-TECH-01",
            phcCenter: draft.phcCenter,
            district: draft.district
          })
        });

        if (createRes.ok) {
          const scrData = await createRes.json();
          // Execute analyze
          await fetch(`http://localhost:8000/api/v1/screenings/${scrData.screeningId}/analyze`, {
            method: 'POST',
            headers: { 'X-Idempotency-Key': draft.idempotencyKey }
          });
          return true; // Successfully uploaded & analyzed!
        }
      } catch (err: unknown) {
        draft.lastError = err instanceof Error ? err.message : "Network request failed";
      }

      attempt++;
      const delayMs = Math.pow(2, attempt) * 500; // Exponential backoff (1s, 2s, 4s, 8s)
      await new Promise(res => setTimeout(res, delayMs));
    }

    return false;
  }
}

export const syncEngine = new SyncEngine();

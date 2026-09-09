# DrishtiSetu Rural Low-Connectivity & Offline Sync Architecture

## 1. Executive Summary & Clinical Safety Principle
In rural Primary Health Centers (PHCs) and mobile screening camps across India, internet connectivity is often intermittent, low-bandwidth (2G/3G), or completely absent. 

**Core Safety Principle:**
> **Never claim that an offline screening has completed AI diabetic-retinopathy (DR) diagnosis unless an accredited edge PyTorch/ONNX model is running locally on the field device.**
> If edge inference is not loaded, the application MUST preserve all patient metadata and fundus image drafts locally and clearly display: **"Connection unavailable — Your screening is safely queued for synchronization"** and **"Awaiting secure synchronization"**.

---

## 2. Low-Connectivity Architecture

```
[ Field Camera / Laptop ]
       │
       ▼
 [ Sync Engine ] ──► (Offline? Save to localStorage: 'drishtisetu_offline_queue')
       │
 (Online Detected)
       │
       ▼
 [ Exponential Backoff Retry ] ──(Header: X-Idempotency-Key)──► [ FastAPI Server ]
                                                                       │
                                                                       ▼
                                                           [ Idempotency Cache ]
                                                                       │
                                                                       ▼
                                                           [ ML DR Pipeline ]
```

---

## 3. Four Core Connectivity States

The Navbar badge and client SyncEngine maintain four strict states:

| Status State | Color Indicator | Description |
| :--- | :--- | :--- |
| `ONLINE` | Emerald Dot Pulse | Full high-speed connectivity to cloud/server backend. Real-time inference enabled. |
| `SYNCING` | Cyan Spinning Wheel | Active background transmission of queued screening drafts. |
| `OFFLINE` | Amber WifiOff Icon | Network unreachable or operator toggle enabled. Drafts are safely preserved locally. |
| `SYNC_FAILED` | Rose Alert Triangle | Retry limits exceeded or server error encountered. Manual retry available. |

---

## 4. Key Mechanisms

### 4.1 Local Persistence & Queue Management
- **Key:** `drishtisetu_offline_queue` in `localStorage`.
- **Payload:** Screening ID (`SCR-2026-XXXX`), Patient Alias, PHC Center, District, Timestamp, Image Base64 Data URL / Path, and Idempotency Key.
- **Privacy:** Minimal non-sensitive patient identifiers stored in browser storage to adhere to HIPAA/DISHA guidelines.

### 4.2 Duplicate Protection & Idempotency
- Client generates a UUID-based `X-Idempotency-Key` (e.g. `IDEM-1725789100-A4B2`).
- FastAPI server inspects `X-Idempotency-Key` on `POST /api/v1/screenings`.
- If an existing record exists for this idempotency key, the server returns the previously created record without creating duplicate database rows or running duplicate ML model passes.

### 4.3 Exponential Backoff Retries
- Retry delays scale exponentially: **$1s, 2s, 4s, 8s$** (up to a maximum of 4 attempts per draft).
- Prevents network saturation on congested rural cell towers (2G/EDGE).

---

## 5. Simulation Page Connectivity Selector
The Simulink District Capacity page includes an interactive **Rural Network Connectivity Selector**:
1. **Good Connectivity (5.0 Mbps):** Instant cloud transmission ($\approx 10s$ latency). Zero queue accumulation.
2. **Moderate Connectivity (1.5 Mbps):** Slight transmission latency ($\approx 30s$ per scan).
3. **Poor Connectivity / 2G (0.2 Mbps):** High upload delay ($\approx 180s$ per scan), accumulating transmission backlog in MB, and delayed review queue throughput.

---

## 6. Limitations & Operational Guidelines
1. **Local Storage Limits:** Web browser `localStorage` is capped at $\approx 5-10\text{ MB}$. For long offline deployments, IndexedDB or desktop PWA storage should be configured.
2. **Clinical Disclaimer:** Offline queueing ensures zero data loss during power/network outages, but final DR classification and visual evidence heatmaps are rendered once synced with the cloud ML pipeline.

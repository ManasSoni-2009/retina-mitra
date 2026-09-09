# REST API Specifications

The FastAPI backend exposes RESTful endpoints versioned under `/api/v1`.

## Endpoints Summary
- `GET /api/v1/health` — System status and model health metrics.
- `POST /api/v1/screenings/quality` — Instant image quality check & physical correction tips.
- `POST /api/v1/screenings/analyze` — Full DR screening pipeline (Enhancement + Vessels + Severity + Grad-CAM + Calibration).
- `GET /api/v1/screenings/{id}` — Fetch specific screening record and explainability artifacts.
- `GET /api/v1/escalations/queue` — Fetch ophthalmologist human review queue.
- `POST /api/v1/simulation/run` — Execute Simulink discrete-event queue capacity model.

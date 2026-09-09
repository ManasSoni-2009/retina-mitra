# DrishtiSetu — Simulink Workflow Capacity Simulation (SIH26038)

## 1. System Architecture & Flow Diagram

The **Simulink Workflow Simulation Engine** models the end-to-end operational capacity, queuing delays, network transmission bandwidth, and specialist workload for rural diabetic retinopathy (DR) screening networks.

### Standardized Pipeline Flow Visualizer

```
[ Patient Arrivals ]
        ↓
[ Image Acquisition ] (Fundus Camera at PHC)
        ↓
[ Image Quality Gate ] ──(Ungradable: Blur/Low-Light)──> [ Recapture Guidance ]
        ↓ (Gradable)
[ AI Processing Engine ] (PyTorch ConvNeXt + U-Net)
     ↙           ↘
[ Routine Flow ]   [ Human Review Queue ] (Referable DR / High Uncertainty)
     ↓                    ↓
[ Outcome ] ←── [ Specialist Decision ] (Confirm / Override / Refer)
```

---

## 2. Configurable Input Parameters (15 Variables)

| Parameter Name | Variable Name | Description | Default Baseline Value |
| :--- | :--- | :--- | :--- |
| **Annual Patient Volume** | `annualPatientVolume` | Total targeted patient screenings per year | `12,000` |
| **Patients / Day** | `patientsPerDay` | Daily screening intake at Primary Health Center (PHC) | `40` |
| **Arrival Rate** | `arrivalRatePerHour` | Poisson arrival rate ($\lambda$) in patients/hour | `5.0` |
| **Image Acquisition Time** | `imageAcquisitionTimeMin` | Time required per fundus scan (minutes) | `5.0` |
| **Image Upload Time** | `imageUploadTimeSec` | Calculated latency to upload raw fundus image | `18.0` sec |
| **Network Bandwidth** | `networkBandwidthMbps` | Rural PHC internet upload bandwidth | `2.0` Mbps |
| **Image Size** | `imageSizeMb` | Uncompressed fundus image payload size | `4.5` MB |
| **Quality Failure %** | `qualityFailurePct` | % of scans flagged UNGRADABLE by Quality Gate | `8.5` % |
| **AI Processing Time** | `aiProcessingTimeSec` | Model inference latency per scan (seconds) | `3.5` sec |
| **AI Throughput** | `aiThroughputPerMin` | Maximum AI server processing rate | `17.1` scans/min |
| **Human-Review %** | `humanReviewPct` | % routed to specialist queue (Referable / Uncertain) | `22.0` % |
| **Review Time** | `reviewTimeMin` | Specialist examination duration per escalation | `12.0` min |
| **Number of Reviewers** | `numberOfReviewers` | Active retina specialists assigned to queue | `2` |
| **Working Hours / Day** | `workingHoursPerDay` | Daily PHC operating hours | `8` hours |
| **Working Days / Year** | `workingDaysPerYear` | Operational days per calendar year | `300` days |

---

## 3. Simulation Outputs (10 Capacity Metrics)

1. **Throughput**: Daily and annual completed screenings.
2. **Average Delay**: Total processing latency from patient arrival to final result (hours).
3. **Queue Length**: Current scans awaiting specialist review.
4. **Maximum Queue**: Peak queue buildup during peak operating hours.
5. **Reviewer Utilization %**: Specialist workload percentage ($\rho_{\text{human}}$).
6. **AI Utilization %**: AI server load percentage ($\rho_{\text{AI}}$).
7. **Percentage Requiring Human Review**: Realized escalation rate.
8. **Annual Capacity**: Maximum annual screening throughput supported by network resources.
9. **Transmission Backlog**: Data queued due to low upload bandwidth (MB).
10. **Estimated Completion Time**: Total days required to process annual volume.

---

## 4. Pre-Configured Operational Scenarios

1. **BASELINE**: Standard operational parameters (40 patients/day, 2.0 Mbps, 2 reviewers).
2. **LOW BANDWIDTH (2G)**: Simulates poor rural connectivity (0.5 Mbps upload bandwidth).
3. **HIGH PATIENT VOLUME**: Simulates screening camp surge (100 patients/day).
4. **LIMITED REVIEWERS**: Simulates shortage of specialists (1 reviewer for district).
5. **POOR IMAGE QUALITY**: Simulates high operator motion blur (25% ungradable failure rate).
6. **HIGH HUMAN-REVIEW RATE**: Simulates complex case intake (45% human escalation rate).

> [!NOTE]
> All scenario default values are explicitly tagged as **"Illustrative scenario"** configuration parameters designed for decision-support modeling.

---

## 5. Running the Model in MATLAB / Simulink

### Prerequisites
- MATLAB R2022b or newer with **SimEvents** and **Stateflow** toolboxes.

### Step-by-Step Execution
1. Open MATLAB and navigate to the project directory:
   ```matlab
   cd simulation/
   ```
2. Run the initialization script to populate workspace parameters:
   ```matlab
   simulink_model_setup
   ```
3. Execute multi-scenario comparison and generate plot figures:
   ```matlab
   run_simulink_scenario
   ```

---

## 6. Web UI Integration & Engine Distinction

> [!IMPORTANT]
> **Engine Distinction Labeling:**
> - **Interactive Approximation**: The web UI (`/simulation`) executes a lightweight Python discrete-event queueing engine (`backend/app/services/simulink_service.py`) for real-time interactive parameter tuning.
> - **Simulink Model**: High-fidelity state-space discrete-event simulation executed natively in MATLAB using `simulation/simulink_model_setup.m`.

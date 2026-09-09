# DrishtiSetu — Capacity Simulation & Simulink Integration

**Document Version:** 1.0.0  
**Updated:** September 8, 2026  

This document explains the workflow capacity simulation module in DrishtiSetu, detailing both the **interactive Python queueing model** integrated into the web application and the **standalone MATLAB Simulink model**.

---

## 1. Executive Summary

Diabetic retinopathy screening at scale requires careful capacity planning to prevent bottlenecking at primary healthcare centers (PHCs) and specialist review centers. DrishtiSetu provides:

1. **Interactive Web Capacity Simulator (`/simulation`):** Built with Python queueing theory (`simulink_service.py`) to provide instant, interactive parameter tuning in the web browser.
2. **MATLAB Simulink Model (`simulink/` & `matlab/`):** Standalone Simulink block diagram files (`drishtisetu_workflow_sim.slx`, `simulink_model_setup.m`) for formal discrete-event system modeling.

> ℹ️ **Transparency Label:** The web UI explicitly labels the browser simulator as an *"Interactive capacity simulation model"* so users understand it executes state-space queueing equations in Python rather than running MATLAB directly inside the client browser.

---

## 2. Configurable Workflow Parameters

The simulation models the end-to-end patient screening pipeline:

$$\text{Patient Arrival} \longrightarrow \text{Acquisition} \longrightarrow \text{Quality Gate} \longrightarrow \text{AI Screening} \longrightarrow \text{Review Queue} \longrightarrow \text{Ophthalmologist Final Action}$$

### Inputs:
- **Annual Patient Volume:** Total expected patient population per year (e.g., 5,000 to 100,000).
- **Working Days / Year:** Operating calendar days (default: 250 days).
- **Network Bandwidth (Mbps):** Local connectivity speed affecting upload latency.
- **Image Quality Failure Rate (%):** Percentage of scans requiring recapture.
- **Human Review Routing Rate (%):** Percentage of cases flagged for specialist review (driven by uncertainty and referable severity).
- **Number of Ophthalmologists:** Available review specialists.
- **Average Review Time per Case (mins):** Specialist time allocation.

---

## 3. Key Operational Outputs

- **Daily Patient Throughput:** Expected patient screenings completed per day.
- **Average Total Delay:** End-to-end turnaround time per patient (acquisition to final decision).
- **Reviewer Utilization (%):** Percentage of specialist working hours consumed.
- **Queue Backlog Risk:** Projected bottlenecking in specialist review queues.
- **Annual Operational Capacity:** Maximum sustainable screening volume.

---

## 4. Preset Scenarios

1. **Baseline PHC:** Standard rural primary healthcare clinic volume (15 patients/day, 2 Mbps bandwidth, 1 reviewer).
2. **High Volume Center:** Urban screening hub (120 patients/day, 10 Mbps bandwidth, 3 reviewers).
3. **Low Bandwidth / Remote:** Offline/intermittent primary health center (30 patients/day, 0.5 Mbps bandwidth, queued uploads).
4. **Constrained Specialist Resource:** Limited reviewer availability (80 patients/day, 1 reviewer).

---

## 5. Standalone MATLAB Simulink Setup

To execute the formal Simulink block model in MATLAB:

```matlab
% Navigate to simulink directory
cd('simulink')

% Run parameter setup script
run('simulink_model_setup.m')

% Execute scenario simulation
sim('drishtisetu_workflow_sim.slx')
```

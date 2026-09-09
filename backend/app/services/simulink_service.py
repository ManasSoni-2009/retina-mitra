"""
Discrete-Event Simulation Engine for Rural Health Capacity Planning.
Mirrors the Simulink state-space queuing transfer functions.
"""

import uuid
from datetime import datetime, timezone
from app.schemas.simulation import SimulationInputParams, SimulationResult, ThroughputPoint

def run_discrete_event_simulation(params: SimulationInputParams) -> SimulationResult:
    # 1. Daily Mechanics & Capacity Calculations
    daily_intake = params.patientsPerDay
    work_days = params.workingDaysPerYear
    work_hours = params.workingHoursPerDay
    
    # Quality Gate filtering
    quality_rejected_daily = daily_intake * (params.qualityFailurePct / 100.0)
    quality_passed_daily = daily_intake - quality_rejected_daily

    # Network Transmission
    daily_bandwidth_mb = (params.networkBandwidthMbps * 1000000 / 8) * (work_hours * 3600) / 1000000
    daily_data_needed_mb = quality_passed_daily * params.imageSizeMb
    current_transmission_queue_mb = max(daily_data_needed_mb - daily_bandwidth_mb, 0.0)

    # AI Server Processing Capacity
    ai_total_seconds_per_day = work_hours * 3600
    ai_daily_capacity = int(ai_total_seconds_per_day / max(params.aiProcessingTimeSec, 0.1))
    ai_utilization = min((quality_passed_daily / max(ai_daily_capacity, 1)) * 100.0, 100.0)

    # Human Specialist Reviewer Capacity
    human_review_intake_daily = quality_passed_daily * (params.humanReviewPct / 100.0)
    reviewer_shift_minutes = work_hours * 60
    per_reviewer_daily_capacity = (reviewer_shift_minutes / max(params.reviewTimeMin, 1.0))
    total_human_daily_capacity = per_reviewer_daily_capacity * params.numberOfReviewers

    reviewer_utilization = min((human_review_intake_daily / max(total_human_daily_capacity, 1.0)) * 100.0, 100.0)

    # Queue Dynamics Simulation (30-day timeline)
    timeline = []
    current_human_queue = 0
    total_queue_samples = []
    max_queue_len = 0
    total_completed_daily = 0

    for day in range(1, 31):
        arrived = daily_intake
        ungradable_count = int(arrived * (params.qualityFailurePct / 100.0))
        gradable_count = arrived - ungradable_count
        
        transferred_images = min(gradable_count, int(daily_bandwidth_mb / max(params.imageSizeMb, 0.1)))
        ai_processed = min(transferred_images, ai_daily_capacity)
        
        escalated = int(ai_processed * (params.humanReviewPct / 100.0))
        current_human_queue += escalated
        
        human_reviewed = min(current_human_queue, int(total_human_daily_capacity))
        current_human_queue -= human_reviewed
        
        completed = (ai_processed - escalated) + human_reviewed
        total_completed_daily += completed
        
        if current_human_queue > max_queue_len:
            max_queue_len = current_human_queue
            
        total_queue_samples.append(current_human_queue)
        
        timeline.append(
            ThroughputPoint(
                day=day,
                screenedAtPhc=arrived,
                transferredToCloud=transferred_images,
                aiProcessed=ai_processed,
                escalatedToHuman=escalated,
                finalCompleted=completed
            )
        )

    avg_queue_len = sum(total_queue_samples) / max(len(total_queue_samples), 1)
    avg_delay_hours = (avg_queue_len * params.reviewTimeMin) / 60.0 if params.numberOfReviewers > 0 else 999.0

    throughput_daily = int(total_completed_daily / 30)
    throughput_annual = throughput_daily * work_days
    estimated_annual_capacity = int((total_human_daily_capacity / max(params.humanReviewPct / 100.0, 0.05)) * work_days)

    completion_time_days = round(params.annualPatientVolume / max(throughput_daily, 1), 1)

    bottleneck_alerts = []
    if current_transmission_queue_mb > 20.0:
        bottleneck_alerts.append(f"Network Bandwidth Bottleneck: {current_transmission_queue_mb:.1f} MB upload backlog queued at PHC.")
    if reviewer_utilization > 85.0:
        bottleneck_alerts.append(f"High Specialist Workload: Reviewer utilization at {reviewer_utilization:.1f}%.")
    if params.qualityFailurePct > 20.0:
        bottleneck_alerts.append(f"Quality Failure Alert: {params.qualityFailurePct:.1f}% ungradable rejection rate reduces PHC throughput.")
    if avg_delay_hours > 24.0:
        bottleneck_alerts.append(f"Screening Delay Warning: Escalated queue delay exceeds {avg_delay_hours:.1f} hours.")
    if not bottleneck_alerts:
        bottleneck_alerts.append("System capacity operating within optimal green-zone parameters.")

    return SimulationResult(
        simulationId=f"SIM-{uuid.uuid4().hex[:6].upper()}",
        executedAt=datetime.now(timezone.utc).isoformat(),
        scenarioName=params.scenarioName or "BASELINE",
        params=params,
        engineLabel="Interactive approximation (Fast Python Queue Engine)",
        isSimulinkDirectModel=False,
        illustrativeNotice="Illustrative scenario values used for capacity decision support modeling.",
        throughputDaily=throughput_daily,
        throughputAnnual=throughput_annual,
        estimatedAnnualCapacity=estimated_annual_capacity,
        averageQueueLength=round(avg_queue_len, 1),
        maxQueueLength=round(float(max_queue_len), 1),
        averageProcessingDelayHours=round(avg_delay_hours, 1),
        reviewerUtilizationPct=round(reviewer_utilization, 1),
        aiUtilizationPct=round(ai_utilization, 1),
        humanReviewPct=round(params.humanReviewPct, 1),
        transmissionBacklogMb=round(current_transmission_queue_mb, 1),
        estimatedCompletionTimeDays=completion_time_days,
        bottleneckAlerts=bottleneck_alerts,
        timeline=timeline
    )

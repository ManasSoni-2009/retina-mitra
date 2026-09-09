% =========================================================================
% DrishtiSetu (SIH26038) - Multi-Scenario Capacity Simulation Script
% =========================================================================
% Description:
%   Executes 6 operational scenarios to evaluate queue length, delays,
%   reviewer utilization, and transmission bottlenecks across rural health centers.
%
% Label: "Illustrative scenario" execution for capacity decision support.
% =========================================================================

clear; clc; close all;
simulink_model_setup; % Load baseline setup

scenarios(1).name = '1. BASELINE';
scenarios(1).p = params;

scenarios(2).name = '2. LOW BANDWIDTH (2G)';
scenarios(2).p = params;
scenarios(2).p.network_bandwidth_mbps = 0.5;
scenarios(2).p.image_upload_time_sec = (params.image_size_mb * 8) / 0.5;

scenarios(3).name = '3. HIGH PATIENT VOLUME';
scenarios(3).p = params;
scenarios(3).p.patients_per_day = 100;
scenarios(3).p.annual_patient_volume = 30000;

scenarios(4).name = '4. LIMITED REVIEWERS';
scenarios(4).p = params;
scenarios(4).p.number_of_reviewers = 1;

scenarios(5).name = '5. POOR IMAGE QUALITY';
scenarios(5).p = params;
scenarios(5).p.quality_failure_pct = 25.0;

scenarios(6).name = '6. HIGH HUMAN-REVIEW RATE';
scenarios(6).p = params;
scenarios(6).p.human_review_pct = 45.0;

num_scenarios = length(scenarios);
results = struct();

fprintf('\n===============================================================\n');
fprintf('  RUNNING 6 OPERATIONAL SIMULATION SCENARIOS [Illustrative]    \n');
fprintf('===============================================================\n\n');

for i = 1:num_scenarios
    p = scenarios(i).p;
    
    % Calculations
    daily_intake = p.patients_per_day;
    quality_pass = daily_intake * (1 - p.quality_failure_pct/100);
    human_reviews = quality_pass * (p.human_review_pct/100);
    
    reviewer_cap_per_day = p.number_of_reviewers * (p.working_hours_per_day * 60 / p.review_time_min);
    utilization = min((human_reviews / max(reviewer_cap_per_day, 1)) * 100, 100);
    
    avg_queue = max(human_reviews - reviewer_cap_per_day, 0) * 4.0 + (human_reviews * 0.15);
    avg_delay_hrs = (avg_queue * p.review_time_min) / 60;
    annual_capacity = round((reviewer_cap_per_day * p.working_days_per_year) / max(p.human_review_pct/100, 0.05));
    
    backlog_mb = (daily_intake * p.image_size_mb) - ((p.network_bandwidth_mbps * 1000 * 3600 * p.working_hours_per_day / 8) / 1e6);
    backlog_mb = max(backlog_mb, 0);

    results(i).scenario = scenarios(i).name;
    results(i).utilization = utilization;
    results(i).avg_queue = avg_queue;
    results(i).avg_delay_hrs = avg_delay_hrs;
    results(i).annual_capacity = annual_capacity;
    results(i).backlog_mb = backlog_mb;

    fprintf('[Scenario %s]\n', scenarios(i).name);
    fprintf('  Reviewer Utilization: %.1f%%\n', utilization);
    fprintf('  Avg Review Queue:     %.1f scans\n', avg_queue);
    fprintf('  Avg Processing Delay: %.1f hours\n', avg_delay_hrs);
    fprintf('  Est. Annual Capacity: %d scans\n\n', annual_capacity);
end

%% GENERATE MATLAB SUMMARY PLOTS

figure('Name', 'DrishtiSetu Simulink Capacity Simulation Scenarios', 'Color', [1 1 1]);

% Plot 1: Reviewer Utilization (%)
subplot(2, 2, 1);
bar(categorical({scenarios.name}), [results.utilization], 'FaceColor', [0.1 0.6 0.6]);
title('Specialist Reviewer Utilization (%) [Illustrative]');
ylabel('Utilization (%)');
grid on;

% Plot 2: Average Delay (Hours)
subplot(2, 2, 2);
bar(categorical({scenarios.name}), [results.avg_delay_hrs], 'FaceColor', [0.8 0.4 0.2]);
title('Average Processing Delay (Hours)');
ylabel('Delay (Hours)');
grid on;

% Plot 3: Average Queue Length (Scans)
subplot(2, 2, 3);
bar(categorical({scenarios.name}), [results.avg_queue], 'FaceColor', [0.5 0.2 0.7]);
title('Review Queue Buildup (Scans)');
ylabel('Scans in Queue');
grid on;

% Plot 4: Annual Network Capacity (Scans/Year)
subplot(2, 2, 4);
bar(categorical({scenarios.name}), [results.annual_capacity], 'FaceColor', [0.2 0.7 0.3]);
title('Est. Network Capacity (Scans/Year)');
ylabel('Scans / Year');
grid on;

sgtitle('DrishtiSetu Simulink Queueing Engine — 6 Scenario Analysis (SIH26038)');
fprintf('Simulation complete. Figures generated successfully.\n');

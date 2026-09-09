% =========================================================================
% DrishtiSetu (SIH26038) - Simulink Discrete-Event Queueing Model Setup
% =========================================================================
% Description:
%   Configures parameters, state-space variables, and SimEvents / Stateflow 
%   queueing blocks for rural tele-ophthalmology screening capacity planning.
%
% Note:
%   Default parameter values represent an "Illustrative scenario" for 
%   demonstration purposes. Replace with empirically validated PHC data.
% =========================================================================

clear; clc;
fprintf('===============================================================\n');
fprintf('  DrishtiSetu - Simulink Capacity Simulation Setup (SIH26038)  \n');
fprintf('  [Illustrative scenario configuration loaded]                 \n');
fprintf('===============================================================\n\n');

%% 1. PIPELINE SYSTEM PARAMETERS (15 CONFIGURABLE VARIABLES)

% A. Patient Volume & Arrival Rate
params.annual_patient_volume    = 12000;    % Total annual target screening volume
params.patients_per_day         = 40;       % Average daily patient volume per PHC
params.arrival_rate_per_hour    = 5.0;      % Poisson arrival rate (lambda, patients/hr)
params.working_hours_per_day    = 8;        % PHC operating hours per day
params.working_days_per_year    = 300;      % Operating days per calendar year

% B. Image Acquisition & Tele-Transmission
params.image_acquisition_time_min = 5.0;    % Time per fundus scan (minutes)
params.image_size_mb             = 4.5;    % Uncompressed fundus image file size (MB)
params.network_bandwidth_mbps    = 2.0;    % Rural PHC upload bandwidth (Mbps)
params.image_upload_time_sec     = (params.image_size_mb * 8) / params.network_bandwidth_mbps; % Derived upload time (sec)

% C. Quality Gate & AI Processing Engine
params.quality_failure_pct       = 8.5;    % % rejected by Quality Gate (ungradable, blur, low light)
params.ai_processing_time_sec    = 3.5;    % PyTorch ConvNeXt GPU/CPU inference latency (sec)
params.ai_throughput_per_min     = 60 / params.ai_processing_time_sec; % Scans processed per min

% D. Human-in-the-Loop Specialist Review
params.human_review_pct          = 22.0;   % % routed to specialist review (referable DR + high uncertainty)
params.review_time_min           = 12.0;   % Average specialist review duration per scan (minutes)
params.number_of_reviewers       = 2;      % Number of active retina specialists assigned to queue

%% 2. SIMULINK SIMEVENTS / DISCRETE-EVENT ENGINE CONFIGURATION

% Define M/M/c Queueing Parameters
c = params.number_of_reviewers;
mu_human = 60 / params.review_time_min; % Service rate per reviewer (scans/hour)
lambda_human = (params.patients_per_day * (params.human_review_pct / 100)) / params.working_hours_per_day; % Arrival rate to review queue (scans/hour)

% Calculate Utilization (rho)
rho_human = lambda_human / (c * mu_human);
rho_ai = (params.patients_per_day / params.working_hours_per_day) / (params.ai_throughput_per_min * 60);

fprintf('--- PRE-SIMULATION ANALYTICAL QUEUE ESTIMATES ---\n');
fprintf('Patient Arrival Rate (lambda): %.2f patients/hour\n', params.arrival_rate_per_hour);
fprintf('Image Transmission Time:       %.2f seconds per image\n', params.image_upload_time_sec);
fprintf('AI Server Throughput:          %.1f scans/minute (Utilization: %.1f%%)\n', params.ai_throughput_per_min, rho_ai * 100);
fprintf('Human Review Queue Arrival:    %.2f scans/hour\n', lambda_human);
fprintf('Reviewer Capacity (c = %d):    %.2f scans/hour (Utilization: %.1f%%)\n', c, c * mu_human, rho_human * 100);

if rho_human >= 1.0
    fprintf('⚠️ WARNING: Review queue is UNSTABLE (rho >= 100%%). Backlog will grow indefinitely!\n');
else
    fprintf('✓ SYSTEM STABLE: Review queue operating within capacity limits.\n');
end

%% 3. SAVE PARAMETERS TO WORKSPACE FOR SIMULINK MODEL
assignin('base', 'params', params);
assignin('base', 'rho_human', rho_human);
assignin('base', 'rho_ai', rho_ai);

fprintf('\nParameters successfully initialized in workspace struct "params".\n');
fprintf('To run scenario simulations, execute "run_simulink_scenario.m".\n');

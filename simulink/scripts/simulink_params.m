% DrishtiSetu - Simulink Model Parameters Configuration Script
% Defines state-space queue parameters for rural health screening capacity

% Patient intake parameters
annual_volume = 12000;
daily_intake = 40; % patients per day per PHC

% Image parameters
image_size_mb = 4.5;
network_bandwidth_mbps = 2.0;

% Processing parameters
ai_processing_time_sec = 3.5;
ophthalmologist_review_time_min = 12.0;
num_reviewers = 2;

% Flow percentages
pct_ungradable = 0.085;
pct_referred = 0.180;
pct_human_review = 0.220;

fprintf('DrishtiSetu Simulink Parameters Initialized.\n');

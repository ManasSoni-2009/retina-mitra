% DrishtiSetu - MATLAB Retinal Field of View (FOV) Coverage Ratio
% Thresholds green channel to measure circular retinal mask area

function fovScore = fov_coverage(greenImg)
    mask = greenImg > 20;
    fovRatio = sum(mask(:)) / numel(greenImg);
    fovScore = min(fovRatio / 0.50, 1.0);
end

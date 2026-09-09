% DrishtiSetu - MATLAB Retinal Fundus Quality Assessment
% Computes focus sharpness, HSV illumination, FOV coverage, and glare heuristics.

function qualityReport = dr_quality_assessment(rgbImg)
    % 1. Extract Green channel for high contrast structural analysis
    green = rgbImg(:,:,2);
    
    % 2. Calculate Laplacian Variance Sharpness
    sharpnessScore = laplacian_sharpness(green);
    
    % 3. Calculate HSV Illumination Uniformity
    illuminationScore = hsv_illumination(rgbImg);
    
    % 4. Calculate Retinal Field of View (FOV) Coverage Ratio
    fovScore = fov_coverage(green);
    
    % Composite Quality Score Index (0.0 to 1.0)
    overallScore = (sharpnessScore * 0.40) + (illuminationScore * 0.35) + (fovScore * 0.25);
    
    % Quality Gate Decision (Configurable Thresholds)
    if overallScore >= 0.65
        qualityStatus = 'GRADABLE';
    elseif overallScore >= 0.45
        qualityStatus = 'BORDERLINE';
    else
        qualityStatus = 'UNGRADABLE';
    end
    
    qualityReport = struct(...
        'qualityStatus', qualityStatus, ...
        'overallScore', overallScore, ...
        'focusScore', sharpnessScore, ...
        'illuminationScore', illuminationScore, ...
        'fieldOfViewScore', fovScore, ...
        'isPrototypeHeuristic', true ...
    );
end

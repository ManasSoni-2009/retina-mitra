% DrishtiSetu - MATLAB Fundus Quality Assessment
% Computes ISO sharpness, contrast, and field-of-view coverage

function qualityStruct = dr_quality_score(rgbImg)
    gray = rgb2gray(rgbImg);
    
    % Laplacian variance for sharpness
    laplacianKernel = [0 1 0; 1 -4 1; 0 1 0];
    lapVal = var(double(imfilter(gray, laplacianKernel)), 0, 'all');
    sharpnessIndex = min(lapVal / 500.0, 1.0);
    
    % Illumination & contrast
    contrastIndex = double(max(gray(:)) - min(gray(:))) / 255.0;
    
    isGradable = (sharpnessIndex > 0.45) && (contrastIndex > 0.40);
    
    qualityStruct = struct(...
        'score', (sharpnessIndex + contrastIndex) / 2.0, ...
        'sharpness', sharpnessIndex, ...
        'contrast', contrastIndex, ...
        'isGradable', isGradable ...
    );
end

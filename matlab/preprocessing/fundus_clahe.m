% DrishtiSetu - MATLAB Fundus Image CLAHE Preprocessing
% Contrast Limited Adaptive Histogram Equalization for Green Channel Isolation

function enhancedImg = fundus_clahe(rgbImg)
    % Extract green channel (highest contrast for retinal structures)
    greenChannel = rgbImg(:,:,2);
    
    % Apply CLAHE (Tile size 8x8, Clip limit 0.02)
    enhancedImg = adapthisteq(greenChannel, 'NumTiles', [8 8], 'ClipLimit', 0.02);
end

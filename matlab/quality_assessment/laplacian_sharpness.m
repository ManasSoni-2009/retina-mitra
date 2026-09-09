% DrishtiSetu - MATLAB Laplacian Focus Sharpness Calculator
% Computes variance of Laplacian operator over green channel

function sharpnessScore = laplacian_sharpness(greenImg)
    lapKernel = [0 1 0; 1 -4 1; 0 1 0];
    lapFiltered = imfilter(double(greenImg), lapKernel);
    lapVar = var(lapFiltered(:));
    sharpnessScore = min(lapVar / 400.0, 1.0);
end

% DrishtiSetu - MATLAB HSV Illumination Uniformity Calculator

function illuminationScore = hsv_illumination(rgbImg)
    hsv = rgb2hsv(rgbImg);
    vChannel = hsv(:,:,3) * 255.0;
    vMean = mean(vChannel(:));
    illuminationScore = max(0.0, 1.0 - (abs(vMean - 125.0) / 125.0));
end

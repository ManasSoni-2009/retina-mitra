'use client';

import React, { useState } from 'react';
import { Upload, RefreshCw } from 'lucide-react';
import { ImageQualityDetail } from '@/types/screening';

interface UploadBoxProps {
  onQualityChecked: (quality: ImageQualityDetail, file: File, sampleType: string) => void;
}

export const UploadBox: React.FC<UploadBoxProps> = ({ onQualityChecked }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulatedSelect = (sampleType: 'gradable' | 'ungradable' | 'moderate') => {
    setLoading(true);
    setTimeout(() => {
      let fileName = 'fundus_normal.png';
      let mockQuality: ImageQualityDetail = {
        qualityStatus: 'GRADABLE',
        score: 0.92,
        illumination: 0.94,
        contrast: 0.91,
        sharpness: 0.90,
        fovCoverage: 0.95,
        guidanceTips: []
      };

      if (sampleType === 'ungradable') {
        fileName = 'fundus_blur.png';
        mockQuality = {
          qualityStatus: 'UNGRADABLE',
          score: 0.32,
          illumination: 0.40,
          contrast: 0.30,
          sharpness: 0.25,
          fovCoverage: 0.60,
          guidanceTips: [
            "Image sharpness is insufficient due to severe motion blur.",
            "Ensure pupil dilation or ask patient to blink before capture.",
            "Clean camera objective lens to eliminate fogging."
          ]
        };
      } else if (sampleType === 'moderate') {
        fileName = 'fundus_moderate.png';
        mockQuality = {
          qualityStatus: 'BORDERLINE',
          score: 0.88,
          illumination: 0.86,
          contrast: 0.89,
          sharpness: 0.87,
          fovCoverage: 0.90,
          guidanceTips: []
        };
      }

      const dummyFile = new File(['dummy content'], fileName, { type: 'image/png' });
      setSelectedFile(dummyFile);
      setLoading(false);
      onQualityChecked(mockQuality, dummyFile, sampleType);
    }, 600);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-3xl p-9 text-center transition-all backdrop-blur-2xl ${
          dragActive
            ? 'border-[#0B1728] bg-gradient-to-br from-white/95 via-[#F8FAFC]/90 to-[#2563EB]/40 shadow-2xl scale-101'
            : 'border-slate-200 bg-gradient-to-br from-white/90 via-[#F8FAFC]/75 to-[#2563EB]/25 hover:border-[#0B1728] hover:shadow-xl'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleSimulatedSelect('gradable');
          }
        }}
      >
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1728] via-[#10213E] to-[#3C5880] flex items-center justify-center text-[#2563EB] mb-3.5 shadow-xl shadow-[#0B1728]/25 border border-white/20">
          <Upload className="w-7 h-7" />
        </div>
        <h4 className="text-base font-black text-[#0B1728]">Upload Fundus Image Scan</h4>
        <p className="text-xs text-[#3C5880] mt-1 max-w-md mx-auto font-semibold leading-relaxed">
          Supports high-resolution PNG, JPG, or DICOM fundus photographs from portable tele-ophthalmology cameras.
        </p>

        {loading ? (
          <div className="mt-5 inline-flex items-center space-x-2 text-xs font-black text-[#0B1728]">
            <RefreshCw className="w-4 h-4 animate-spin text-[#059669]" />
            <span>Evaluating Image Quality Gate Metrics...</span>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleSimulatedSelect('gradable')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#059669] to-[#5B705E] hover:from-[#6B806E] hover:to-[#4D6250] text-[#FFFFFF] text-xs font-black shadow-lg shadow-[#059669]/25 transition"
            >
              Test Gradable Normal Scan
            </button>
            <button
              onClick={() => handleSimulatedSelect('moderate')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0B1728] via-[#10213E] to-[#3C5880] hover:from-[#10213E] hover:to-[#0B1728] text-[#FFFFFF] text-xs font-black shadow-lg shadow-[#0B1728]/30 transition"
            >
              Test Moderate NPDR Scan
            </button>
            <button
              onClick={() => handleSimulatedSelect('ungradable')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-800 hover:to-rose-950 text-white text-xs font-black shadow-lg shadow-rose-900/25 transition"
            >
              Test Ungradable Blur Scan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
